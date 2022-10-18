class MiCloudUtils {

  static compareErrorCode(responseCode, codeToCompare) {
    let responceCodeStr = String(responseCode);
    return responceCodeStr.startsWith('-70') && responceCodeStr.slice(-3) === codeToCompare;
  }

}

module.exports = MiCloudUtils;
