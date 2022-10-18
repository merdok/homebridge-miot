module.exports = class UnknownDeviceModelError extends Error {
  constructor() {
    super(`Could not identify the device model!`);
  }
}
