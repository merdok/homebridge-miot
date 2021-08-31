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

  debug(message, ...args) {
    this.log.debug((this.name ? `[${this.name}] ` : "") + message, ...args);
  }

  error(message, ...args) {
    this.log.error((this.name ? `[${this.name}] ` : "") + message, ...args);
  }

  // extended
  deepDebug(message, ...args) {
    if (this.isDeepDebugLogEnabled() === true) {
      this.debug(message, ...args)
    }
  }



}

module.exports = Logger;
