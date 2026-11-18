const MiotSpecFetcher = require('../protocol/MiotSpecFetcher.js');

class SpecVersionUtils {

  // Fire-and-forget spec-version drift check. Compares the version pinned in the
  // device's getMiotSpecUrl() against the latest version published for its model
  // and logs a warning if a newer spec exists. Any failure (no url, offline,
  // timeout, model not found) is swallowed at deepDebug - this is only a
  // maintainer hint and must never affect device startup.
  static checkDeviceSpecVersionIsCurrent(deviceInstance, logger) {
    Promise.resolve().then(async () => {
      const model = deviceInstance.getModel();
      const specUrl = deviceInstance.getMiotSpecUrl();
      const pinnedVersion = SpecVersionUtils.parseSpecVersionFromUrl(specUrl);
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

  // Extracts the integer spec version from a miot spec instance url. The version
  // is the first purely-numeric segment following the vendor-model token in the
  // urn, e.g. ...:ymt-test01:1 -> 1. Some urls carry a trailing hex template
  // segment (...:xiaomi-p45:1:0000D062), so we take the first numeric segment
  // rather than the last. Returns undefined if no version can be parsed.
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

module.exports = SpecVersionUtils;
