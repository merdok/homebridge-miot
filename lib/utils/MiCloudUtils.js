const MiCloudErrorCodes = require("./MiCloudErrorCodes.js");

class MiCloudUtils {

  static isDeviceOfflineResponseCode(responseCode) {
    return MiCloudUtils.compareErrorCode(responseCode, MiCloudErrorCodes.DEVICE_OFFLINE);
  }

  static compareErrorCode(responseCode, codeToCompare) {
    let responceCodeStr = String(responseCode);
    return responceCodeStr.startsWith('-70') && responceCodeStr.slice(-3) === codeToCompare;
  }

}

module.exports = MiCloudUtils;
