class HomeKitUtils {

  static sanitizeHomeKitName(name) {
    // Returns a name containing only allowed HomeKit device name characters
    return name.replace(/[^\p{L}\p{N} ']/ug, '').replace(/^[ ']*/, '').replace(/[ ']*$/, '') || 'Unnamed';
  }

}

module.exports = HomeKitUtils;
