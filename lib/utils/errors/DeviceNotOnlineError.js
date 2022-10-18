module.exports = class DeviceNotOnlineError extends Error {
  constructor(deviceId) {
    super(`The device with id ${deviceId} is not online!`);
  }
}
