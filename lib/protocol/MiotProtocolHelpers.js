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

}

module.exports = MiotProtocolHelpers;
