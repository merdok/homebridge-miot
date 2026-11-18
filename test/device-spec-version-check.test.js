const assert = require('node:assert/strict');
const test = require('node:test');

const SpecVersionUtils = require('../lib/utils/SpecVersionUtils.js');
const MiotSpecFetcher = require('../lib/protocol/MiotSpecFetcher.js');

// Issue #773 follow-up: bundled device definitions pin a miot spec version in
// getMiotSpecUrl(). When the vendor publishes a newer spec version for the same
// model, the plugin should log a (maintainer-facing) warning at device load.
// The check is best-effort and fire-and-forget: it must never throw out of
// createDevice and must warn only when the published version is actually newer.

function makeLogger() {
  const logs = { warn: [], deepDebug: [] };
  return {
    logger: {
      info() {}, error() {}, debug() {},
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

// let the fire-and-forget promise chain settle
const flush = () => new Promise(resolve => setImmediate(resolve));

const URL_V1 = 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:flowerpot:0000A047:ymt-test01:1';
const URL_HEX = 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:xiaomi-p45:1:0000D062';


test('_parseSpecVersionFromUrl handles both url shapes and missing urls', () => {
  assert.equal(SpecVersionUtils.parseSpecVersionFromUrl(URL_V1), 1);
  // trailing hex template segment must not be read as the version
  assert.equal(SpecVersionUtils.parseSpecVersionFromUrl(URL_HEX), 1);
  assert.equal(SpecVersionUtils.parseSpecVersionFromUrl('https://x/instance?type=urn:miot-spec-v2:device:airer:0000A00D:hyd-znlyj1:2'), 2);
  assert.equal(SpecVersionUtils.parseSpecVersionFromUrl(null), undefined);
  assert.equal(SpecVersionUtils.parseSpecVersionFromUrl(''), undefined);
});

test('warns when a newer spec version is published for the model', async () => {
  const { logger, logs } = makeLogger();
  const orig = MiotSpecFetcher.getLatestVersionForModel;
  MiotSpecFetcher.getLatestVersionForModel = async () => 3; // newer than pinned v1
  try {
    SpecVersionUtils.checkDeviceSpecVersionIsCurrent(makeDevice('ymt.flowerpot.test01', URL_V1), logger);
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
    SpecVersionUtils.checkDeviceSpecVersionIsCurrent(makeDevice('ymt.flowerpot.test01', URL_V1), logger);
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
    SpecVersionUtils.checkDeviceSpecVersionIsCurrent(makeDevice('some.model.x', null), logger);
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
    SpecVersionUtils.checkDeviceSpecVersionIsCurrent(makeDevice('ymt.flowerpot.test01', URL_V1), logger);
    await flush();
  } finally {
    MiotSpecFetcher.getLatestVersionForModel = orig;
  }
  assert.equal(logs.warn.length, 0, 'a failed check produces no warning');
  assert.equal(logs.deepDebug.length, 1, 'failure is logged at deepDebug only');
});
