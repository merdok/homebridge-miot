//use chalk for coloring?
// https://www.npmjs.com/package/chalk
// example: https://github.com/homebridge/homebridge/blob/master/src/logger.ts
// also need to pass whether homebridge debug is enabled or not

class Logger {
  constructor(log, name) {
    this.log = log || console;
    this.name = name;
    this.deepDebugLog = false;
    this.silentLog = false;
  }

  setDeepDebugLogEnabled(enabled) {
    this.deepDebugLog = enabled;
  }

  isDeepDebugLogEnabled() {
    return this.deepDebugLog;
  }

  setSilentLogEnabled(enabled) {
    this.silentLog = enabled;
  }

  isSilentLogEnabled() {
    return this.silentLog;
  }

  info(message, ...args) {
    if (this.isSilentLogEnabled() === false) {
      this.log.info((this.name ? `[${this.name}] ` : "") + message, ...args);
    } else {
      this.debug(message, ...args);
    }
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

  table(...args) {
    console.table(...args);
  }

  // extended
  deepDebug(message, ...args) {
    if (this.isDeepDebugLogEnabled() === true) {
      this.debug(message, ...args);
    }
  }

}

module.exports = Logger;
