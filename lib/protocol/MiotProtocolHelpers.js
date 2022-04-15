class MiotProtocolHelpers {

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
    return MiotProtocolHelpers.isValidMiotId(value) ? value : null;
  }

}

module.exports = MiotProtocolHelpers;
