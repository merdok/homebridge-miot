const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const MiotSpecUtils = require('../lib/utils/MiotSpecUtils.js');
const MiotProtocolUtils = require('../lib/utils/MiotProtocolUtils.js');
const MiotSpecFetcher = require('../lib/protocol/MiotSpecFetcher.js');

// Issue #773 follow-up. Two best-effort, fire-and-forget behaviours around miot
// spec versions:
//   1. classed devices: warn at load if the bundled definition is behind the
//      latest published spec version (checkDeviceSpecVersionIsCurrent).
//   2. class-less devices: their spec is cached to <specDir>/<model>.spec.json
//      and never re-fetched; refreshCachedSpecIfStale re-fetches and overwrites
//      the cache in the background when a newer version is published.
// Neither must ever throw out of its caller or affect device startup.

function makeLogger() {
  const logs = { warn: [], info: [], debug: [], deepDebug: [] };
  return {
    logger: {
      error() {},
      info(msg) { logs.info.push(msg); },
      debug(msg) { logs.debug.push(msg); },
      warn(msg) { logs.warn.push(msg); },
      deepDebug(msg) { logs.deepDebug.push(msg); },
      table() {}
    },
    logs
  };
}

function makeDevice(model, specUrl) {
  return { getModel: () => model, getMiotSpecUrl: () => specUrl };
}

// let the fire-and-forget promise chain settle (several awaits deep)
const flush = async () => {
  for (let i = 0; i < 10; i++) {
    await new Promise(resolve => setImmediate(resolve));
  }
};

// a fire-and-forget op with a real disk write has no completion signal, so poll
// for the observable outcome (a predicate) instead of guessing a fixed delay
const waitFor = async (predicate, timeoutMs = 2000) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return true;
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  return predicate();
};

const URL_V1 = 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:flowerpot:0000A047:ymt-test01:1';
const URL_HEX = 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:xiaomi-p45:1:0000D062';
// a raw urn, as stored in a cached spec's `type` field
const URN_V1 = 'urn:miot-spec-v2:device:flowerpot:0000A047:ymt-test01:1';


test('parseSpecVersionFromUrl handles url shapes, raw urns and missing input', () => {
  assert.equal(MiotProtocolUtils.parseSpecVersionFromUrl(URL_V1), 1);
  // trailing hex template segment must not be read as the version
  assert.equal(MiotProtocolUtils.parseSpecVersionFromUrl(URL_HEX), 1);
  assert.equal(MiotProtocolUtils.parseSpecVersionFromUrl('https://x/instance?type=urn:miot-spec-v2:device:airer:0000A00D:hyd-znlyj1:2'), 2);
  // works on a raw urn (cached spec .type), not just a full url
  assert.equal(MiotProtocolUtils.parseSpecVersionFromUrl(URN_V1), 1);
  assert.equal(MiotProtocolUtils.parseSpecVersionFromUrl(null), undefined);
  assert.equal(MiotProtocolUtils.parseSpecVersionFromUrl(''), undefined);
});

test('warns when a newer spec version is published for the model', async () => {
  const { logger, logs } = makeLogger();
  const orig = MiotSpecFetcher.getLatestVersionForModel;
  MiotSpecFetcher.getLatestVersionForModel = async () => 3; // newer than pinned v1
  try {
    MiotSpecUtils.checkDeviceSpecVersionIsCurrent(makeDevice('ymt.flowerpot.test01', URL_V1), logger);
    await flush();
  } finally {
    MiotSpecFetcher.getLatestVersionForModel = orig;
  }
  assert.equal(logs.warn.length, 1, 'exactly one warning should be logged');
  assert.match(logs.warn[0], /v1/, 'warning mentions the pinned version');
  assert.match(logs.warn[0], /v3/, 'warning mentions the newer version');
});

test('does not warn when the pinned version is current', async () => {
  const { logger, logs } = makeLogger();
  const orig = MiotSpecFetcher.getLatestVersionForModel;
  MiotSpecFetcher.getLatestVersionForModel = async () => 1; // equal to pinned
  try {
    MiotSpecUtils.checkDeviceSpecVersionIsCurrent(makeDevice('ymt.flowerpot.test01', URL_V1), logger);
    await flush();
  } finally {
    MiotSpecFetcher.getLatestVersionForModel = orig;
  }
  assert.equal(logs.warn.length, 0, 'no warning when versions match');
});

test('skips devices without a pinned spec url (class-less / generic)', async () => {
  const { logger, logs } = makeLogger();
  const orig = MiotSpecFetcher.getLatestVersionForModel;
  let fetcherCalled = false;
  MiotSpecFetcher.getLatestVersionForModel = async () => { fetcherCalled = true; return 5; };
  try {
    MiotSpecUtils.checkDeviceSpecVersionIsCurrent(makeDevice('some.model.x', null), logger);
    await flush();
  } finally {
    MiotSpecFetcher.getLatestVersionForModel = orig;
  }
  assert.equal(fetcherCalled, false, 'no registry lookup when there is no pinned spec url');
  assert.equal(logs.warn.length, 0);
});

test('swallows fetch failures (best-effort, never throws, no warning)', async () => {
  const { logger, logs } = makeLogger();
  const orig = MiotSpecFetcher.getLatestVersionForModel;
  MiotSpecFetcher.getLatestVersionForModel = async () => { throw new Error('network down'); };
  try {
    // must not throw synchronously or reject unhandled
    MiotSpecUtils.checkDeviceSpecVersionIsCurrent(makeDevice('ymt.flowerpot.test01', URL_V1), logger);
    await flush();
  } finally {
    MiotSpecFetcher.getLatestVersionForModel = orig;
  }
  assert.equal(logs.warn.length, 0, 'a failed check produces no warning');
  assert.equal(logs.deepDebug.length, 1, 'failure is logged at deepDebug only');
});


/*----------========== refreshCachedSpecIfStale ==========----------*/

function makeTempSpecDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'miot-spec-'));
  return dir.endsWith(path.sep) ? dir : dir + path.sep;
}

const MODEL = 'ymt.flowerpot.test01';
const cachedSpec = (version) => ({ type: `urn:miot-spec-v2:device:flowerpot:0000A047:ymt-test01:${version}`, services: [] });

test('refreshes the cached spec file when a newer version is published', async () => {
  const { logger, logs } = makeLogger();
  const specDir = makeTempSpecDir();
  const fileName = specDir + MODEL + '.spec.json';
  const freshSpec = { type: `urn:miot-spec-v2:device:flowerpot:0000A047:ymt-test01:2`, services: [{ siid: 2 }] };

  const origLatest = MiotSpecFetcher.getLatestVersionForModel;
  const origFetch = MiotSpecFetcher.fetchMiotSpecByModel;
  let fetchArgs = null;
  MiotSpecFetcher.getLatestVersionForModel = async () => 2; // newer than cached v1
  MiotSpecFetcher.fetchMiotSpecByModel = async (model, skip) => { fetchArgs = [model, skip]; return freshSpec; };
  try {
    MiotSpecUtils.refreshCachedSpecIfStale(MODEL, specDir, cachedSpec(1), logger);
    await waitFor(() => fs.existsSync(fileName));
  } finally {
    MiotSpecFetcher.getLatestVersionForModel = origLatest;
    MiotSpecFetcher.fetchMiotSpecByModel = origFetch;
    fs.rmSync(specDir, { recursive: true, force: true });
  }
  assert.deepEqual(fetchArgs, [MODEL, true], 'fetches by model with skipDevInfoService=true');
  assert.equal(logs.info.length, 1, 'logs an info line about the cache update');
  assert.match(logs.info[0], /v1/);
  assert.match(logs.info[0], /v2/);
});

test('does not refresh when the cached spec is already current', async () => {
  const { logger, logs } = makeLogger();
  const specDir = makeTempSpecDir();
  const origLatest = MiotSpecFetcher.getLatestVersionForModel;
  const origFetch = MiotSpecFetcher.fetchMiotSpecByModel;
  let fetchCalled = false;
  MiotSpecFetcher.getLatestVersionForModel = async () => 1; // equal to cached
  MiotSpecFetcher.fetchMiotSpecByModel = async () => { fetchCalled = true; return {}; };
  try {
    MiotSpecUtils.refreshCachedSpecIfStale(MODEL, specDir, cachedSpec(1), logger);
    await flush();
  } finally {
    MiotSpecFetcher.getLatestVersionForModel = origLatest;
    MiotSpecFetcher.fetchMiotSpecByModel = origFetch;
    fs.rmSync(specDir, { recursive: true, force: true });
  }
  assert.equal(fetchCalled, false, 'no re-fetch when current');
  assert.equal(logs.info.length, 0, 'no info log when nothing changed');
  assert.equal(fs.existsSync(specDir + MODEL + '.spec.json'), false, 'no file written');
});

test('writes the fresh spec content that will be loaded on the next restart', async () => {
  const { logger } = makeLogger();
  const specDir = makeTempSpecDir();
  const fileName = specDir + MODEL + '.spec.json';
  const freshSpec = { type: `urn:miot-spec-v2:device:flowerpot:0000A047:ymt-test01:2`, services: [{ siid: 2 }], properties: {} };

  const origLatest = MiotSpecFetcher.getLatestVersionForModel;
  const origFetch = MiotSpecFetcher.fetchMiotSpecByModel;
  MiotSpecFetcher.getLatestVersionForModel = async () => 2;
  MiotSpecFetcher.fetchMiotSpecByModel = async () => freshSpec;
  let written;
  try {
    MiotSpecUtils.refreshCachedSpecIfStale(MODEL, specDir, cachedSpec(1), logger);
    await waitFor(() => fs.existsSync(fileName));
    written = JSON.parse(fs.readFileSync(fileName, 'utf8'));
  } finally {
    MiotSpecFetcher.getLatestVersionForModel = origLatest;
    MiotSpecFetcher.fetchMiotSpecByModel = origFetch;
    fs.rmSync(specDir, { recursive: true, force: true });
  }
  assert.deepEqual(written, freshSpec, 'the cache file holds the freshly fetched spec');
});

test('refresh swallows errors and never throws (best-effort)', async () => {
  const { logger, logs } = makeLogger();
  const specDir = makeTempSpecDir();
  const origLatest = MiotSpecFetcher.getLatestVersionForModel;
  MiotSpecFetcher.getLatestVersionForModel = async () => { throw new Error('registry down'); };
  try {
    MiotSpecUtils.refreshCachedSpecIfStale(MODEL, specDir, cachedSpec(1), logger);
    await flush();
  } finally {
    MiotSpecFetcher.getLatestVersionForModel = origLatest;
    fs.rmSync(specDir, { recursive: true, force: true });
  }
  assert.equal(logs.info.length, 0, 'no info log on failure');
  assert.equal(logs.debug.length, 1, 'failure logged at debug only');
});

test('refresh bails out when the cached spec version cannot be parsed', async () => {
  const { logger } = makeLogger();
  const specDir = makeTempSpecDir();
  const origLatest = MiotSpecFetcher.getLatestVersionForModel;
  let lookupCalled = false;
  MiotSpecFetcher.getLatestVersionForModel = async () => { lookupCalled = true; return 2; };
  try {
    MiotSpecUtils.refreshCachedSpecIfStale(MODEL, specDir, { type: 'garbage', services: [] }, logger);
    await flush();
  } finally {
    MiotSpecFetcher.getLatestVersionForModel = origLatest;
    fs.rmSync(specDir, { recursive: true, force: true });
  }
  assert.equal(lookupCalled, false, 'no registry lookup when the cached version is unparseable');
});


/*----------========== loadCachedSpec / saveCachedSpec ==========----------*/

test('saveCachedSpec then loadCachedSpec round-trips the spec object', async () => {
  const { logger } = makeLogger();
  const specDir = makeTempSpecDir();
  const spec = { type: URN_V1, services: [{ siid: 2 }], properties: { 'a:b': { siid: 2, piid: 1 } } };
  let loaded;
  try {
    await MiotSpecUtils.saveCachedSpec(MODEL, specDir, spec, logger);
    loaded = await MiotSpecUtils.loadCachedSpec(MODEL, specDir, logger);
  } finally {
    fs.rmSync(specDir, { recursive: true, force: true });
  }
  assert.deepEqual(loaded, spec, 'the loaded spec equals what was saved');
});

test('loadCachedSpec returns null when there is no cache file', async () => {
  const { logger } = makeLogger();
  const specDir = makeTempSpecDir();
  let loaded;
  try {
    loaded = await MiotSpecUtils.loadCachedSpec(MODEL, specDir, logger);
  } finally {
    fs.rmSync(specDir, { recursive: true, force: true });
  }
  assert.equal(loaded, null, 'missing cache file yields null, not a throw');
});

test('loadCachedSpec returns null and logs at debug on malformed json', async () => {
  const { logger, logs } = makeLogger();
  const specDir = makeTempSpecDir();
  let loaded;
  try {
    fs.writeFileSync(specDir + MODEL + '.spec.json', '{ not valid json', 'utf8');
    loaded = await MiotSpecUtils.loadCachedSpec(MODEL, specDir, logger);
  } finally {
    fs.rmSync(specDir, { recursive: true, force: true });
  }
  assert.equal(loaded, null, 'malformed json yields null, not a throw');
  assert.ok(logs.debug.length >= 1, 'a debug line is logged');
});

test('saveCachedSpec is a no-op when given no spec', async () => {
  const { logger } = makeLogger();
  const specDir = makeTempSpecDir();
  try {
    await MiotSpecUtils.saveCachedSpec(MODEL, specDir, null, logger);
    assert.equal(fs.existsSync(specDir + MODEL + '.spec.json'), false, 'nothing written for a null spec');
  } finally {
    fs.rmSync(specDir, { recursive: true, force: true });
  }
});
