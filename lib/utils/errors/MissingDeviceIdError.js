module.exports = class MissingDeviceIdError extends Error {
  constructor(name) {
    super(`Missing deviceId for ${name}! Deviceid is required for a cloud connection! Please specify a deviceId in the 'config.json' file in order to control the device!`);
  }
}
