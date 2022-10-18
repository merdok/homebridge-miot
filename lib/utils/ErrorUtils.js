const Errors = require("./Errors.js");

class ErrorUtils {

  static isNonRecoverableError(err) {
    if (err instanceof Errors.MissingDeviceId || err instanceof Errors.DeviceNotFound || err instanceof Errors.UnknownDeviceModel || err instanceof Errors.MissingMiCloudCredentials) { // non recoverable errors, do not try to reconnect
      return true;
    }
    return false;
  }

}

module.exports = ErrorUtils;
