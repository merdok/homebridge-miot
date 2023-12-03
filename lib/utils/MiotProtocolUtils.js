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


}

module.exports = MiotProtocolUtils;
