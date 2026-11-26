class MiotProtocolUtils {

  static isValidMiotId(value) {
    if (value === undefined || value === null) {
      return false;
    }
    if (!Number.isInteger(value)) {
      return false;
    }
    return value >= 0;
  }

  static validateMiotId(value) {
    value = parseInt(value); //make sure we always have an integer
    return MiotProtocolUtils.isValidMiotId(value) ? value : null;
  }

  static isSpecId(value) {
    if (value && value.includes('.')) {
      return value.split('.').length == 2;
    }
    return false;
  }

  static isSpecName(value) {
    if (value && value.includes(':')) {
      return value.split(':').length == 2;
    }
    return false;
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

module.exports = MiotProtocolUtils;
