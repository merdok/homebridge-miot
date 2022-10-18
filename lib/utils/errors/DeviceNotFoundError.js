module.exports = class DeviceNotFoundError extends Error {
  constructor(deviceId, country) {
    super(`The device with id ${deviceId} was not found in your MiCloud account on the ${country} server! Please make sure that the specified MiCloud account and country is correct!`);
  }
}
