//use chalk for coloring?
// https://www.npmjs.com/package/chalk
// example: https://github.com/homebridge/homebridge/blob/master/src/logger.ts
// also need to pass whether homebridge debug is enabled or not

class Logger {
  constructor(log, name) {
    this.log = log || console;
    this.name = name;
    this.deepDebugLog = false;
  }

  setDeepDebugLogEnabled(enabled) {
    this.deepDebugLog = enabled;
  }

  isDeepDebugLogEnabled() {
    return this.deepDebugLog;
  }

  info(message, ...args) {
    this.log.info((this.name ? `[${this.name}] ` : "") + message, ...args);
  }

  warn(message, ...args) {
    this.log.warn((this.name ? `[${this.name}] ` : "") + message, ...args);
  }

  error(message, ...args) {
    this.log.error((this.name ? `[${this.name}] ` : "") + message, ...args);
  }

  debug(message, ...args) {
    this.log.debug((this.name ? `[${this.name}] ` : "") + message, ...args);
  }

  // extended
  deepDebug(message, ...args) {
    if (this.isDeepDebugLogEnabled() === true) {
      this.debug(message, ...args)
    }
  }

  network(message, ...args) {
    this.debug('[network] ' + message, ...args);
  }

  deepNetwork(message, ...args) {
    this.deepDebug('[network] ' + message, ...args);
  }

  protocol(message, ...args) {
    this.debug('[protocol] ' + message, ...args);
  }

  deepProtocol(message, ...args) {
    this.deepDebug('[protocol] ' + message, ...args);
  }

  device(message, ...args) {
    this.debug('[device] ' + message, ...args);
  }

  deepDevice(message, ...args) {
    this.deepDebug('[device] ' + message, ...args);
  }

  accessory(message, ...args) {
    this.debug('[accessory] ' + message, ...args);
  }

  deepAccessory(message, ...args) {
    this.deepDebug('[accessory] ' + message, ...args);
  }


}

module.exports = Logger;
