const fs = require('fs').promises;
const MiotSpecFetcher = require('../protocol/MiotSpecFetcher.js');

class MiotSpecUtils {

  // Fire-and-forget spec-version drift check. Compares the version pinned in the
  // device's getMiotSpecUrl() against the latest version published for its model
  // and logs a warning if a newer spec exists. Any failure (no url, offline,
  // timeout, model not found) is swallowed at deepDebug - this is only a
  // maintainer hint and must never affect device startup.
  static checkDeviceSpecVersionIsCurrent(deviceInstance, logger) {
    Promise.resolve().then(async () => {
      const model = deviceInstance.getModel();
      const specUrl = deviceInstance.getMiotSpecUrl();
      const pinnedVersion = MiotSpecUtils.parseSpecVersionFromUrl(specUrl);
      // Only classed devices pin a spec url/version; skip the rest.
      if (!model || pinnedVersion === undefined) {
        return;
      }
      const latestVersion = await MiotSpecFetcher.getLatestVersionForModel(model);
      if (typeof latestVersion === 'number' && latestVersion > pinnedVersion) {
        logger.warn(`Device ${model} uses miot spec v${pinnedVersion} but a newer spec v${latestVersion} is published! The bundled device definition may be outdated.`);
      }
    }).catch((err) => {
      logger.deepDebug(`Spec version check skipped for ${deviceInstance.getModel()}: ${err}`);
    });
  }

  // Fire-and-forget refresh of a locally cached miot spec. A class-less device's
  // spec is fetched once and cached as <specDir>/<model>.spec.json, then reused
  // on every restart and never re-fetched - so it can go stale when the vendor
  // publishes a newer spec version. This compares the cached spec's version
  // against the latest published version and, if a newer one exists, re-fetches
  // and overwrites the cache file in the background. The running device keeps
  // using the already-loaded cached spec; the refreshed spec is picked up on the
  // next restart. Any failure (offline, timeout, write error) is swallowed at
  // debug - it must never block or affect device startup.
  static refreshCachedSpecIfStale(model, specDir, cachedSpec, logger) {
    Promise.resolve().then(async () => {
      if (!model || !specDir || !cachedSpec) {
        return;
      }
      const cachedVersion = MiotSpecUtils.parseSpecVersionFromUrl(cachedSpec.type);
      if (cachedVersion === undefined) {
        return;
      }
      const latestVersion = await MiotSpecFetcher.getLatestVersionForModel(model);
      if (typeof latestVersion !== 'number' || latestVersion <= cachedVersion) {
        return;
      }
      // fetch with skipDevInfoService=true to match the shape index.js caches
      const freshSpec = await MiotSpecFetcher.fetchMiotSpecByModel(model, true);
      await MiotSpecUtils.saveCachedSpec(model, specDir, freshSpec, logger);
      logger.info(`Updated cached miot spec for ${model} from v${cachedVersion} to v${latestVersion}. It will be applied on the next restart.`);
    }).catch((err) => {
      logger.debug(`Cached miot spec refresh skipped for ${model}: ${err}`);
    });
  }

  // Builds the on-disk cache file path for a model's miot spec. specDir is
  // expected to end with a path separator (as index.js constructs it).
  static _cacheFileName(model, specDir) {
    return specDir + model + '.spec.json';
  }

  // Reads and parses a locally cached miot spec. Returns the spec object, or
  // null if there is no cache file or it cannot be parsed (logged at debug).
  static async loadCachedSpec(model, specDir, logger) {
    const fileName = MiotSpecUtils._cacheFileName(model, specDir);
    try {
      const cached = await fs.readFile(fileName, 'utf8');
      if (cached) {
        logger.debug(`Found cached miot spec for device: ${model}`);
        return JSON.parse(cached);
      }
      return null;
    } catch (err) {
      logger.debug('No cached miot spec found! Trying to fetch from https://miot-spec.org/');
      return null;
    }
  }

  // Writes a miot spec to the local cache file. Shared by the initial save
  // (on first fetch) and the background stale-refresh so the path and format
  // are defined in one place. Failures are swallowed at debug.
  static async saveCachedSpec(model, specDir, spec, logger) {
    if (!model || !specDir || !spec) {
      return;
    }
    const fileName = MiotSpecUtils._cacheFileName(model, specDir);
    try {
      await fs.writeFile(fileName, JSON.stringify(spec, null, 2), 'utf8');
      logger.debug('Successfully saved device miot spec!');
    } catch (err) {
      logger.debug(`Could not save device miot spec! Error: ${err}`);
    }
  }

  // Extracts the integer spec version from a miot spec instance url or raw urn.
  // The version is the first purely-numeric segment following the vendor-model
  // token in the urn, e.g. ...:ymt-test01:1 -> 1. Some urls carry a trailing hex
  // template segment (...:xiaomi-p45:1:0000D062), so we take the first numeric
  // segment rather than the last. Returns undefined if no version can be parsed.
  static parseSpecVersionFromUrl(specUrl) {
    if (!specUrl || typeof specUrl !== 'string') {
      return undefined;
    }
    const typeMatch = specUrl.match(/type=(urn:[^&'"]+)/);
    const urn = typeMatch ? typeMatch[1] : specUrl;
    const segments = urn.split(':');
    // urn:miot-spec-v2:device:<type>:<deviceCode>:<vendor-model>:<version>[:<hex>]
    // find the vendor-model token (contains a '-'), then the next numeric segment.
    for (let i = 0; i < segments.length - 1; i++) {
      if (segments[i].includes('-') && /^[0-9]+$/.test(segments[i + 1])) {
        return parseInt(segments[i + 1], 10);
      }
    }
    return undefined;
  }

}

module.exports = MiotSpecUtils;
