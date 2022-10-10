const path = require('path');
const fs = require('fs');
const envPaths = require('env-paths');
const miotPaths = envPaths('miot');
const MiioProtocol = require('../protocol/MiioProtocol');
const Logger = require("../utils/Logger");


class MiioProtocolHelper {
  constructor() {
    this.logger = new Logger();
    this.miioProtocol = new MiioProtocol(this.logger);

    this.configDir = miotPaths.config;
    this.configFile = path.join(this.configDir, 'tokens.json');

    try {
      fs.mkdirSync(this.configDir, {
        recursive: true
      });
    } catch (error) {
      throw new Error(error);
    }

    try {
      this.tokens = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
    } catch (error) {
      this.tokens = {};
    }
  }


  /*----------========== PUBLIC ==========----------*/

  async connect(ip, token) {
    if (!ip) {
      throw new Error(`Device ip must be specified!`);
    }

    if (!token) {
      throw new Error(`Device token must be specified!`);
    }

    this.miioProtocol.updateDevice(ip, {
      token: token
    })

    await this.miioProtocol.handshake(ip);
  }

  async send(ip, command, params, retries = 2, timeout = 5000, debug = false) {
    this.logger.setDeepDebugLogEnabled(debug);
    return this.miioProtocol.send(ip, command, params, {
      retries: retries,
      timeout: timeout
    });
  }

  async getInfo(ip, retries = 3, timeout = 5000, debug = false) {
    this.logger.setDeepDebugLogEnabled(debug);
    return this.miioProtocol.getInfo(ip, {
      retries: retries,
      timeout: timeout
    });
  }

  /*----------========== STORAGE ==========----------*/

  //token
  async updateStoredToken(ip, token) {
    if (!ip) {
      throw new Error(`Device ip must be specified!`);
    }

    if (!token) {
      throw new Error(`Device token must be specified!`);
    }

    this.tokens[ip] = token;
    fs.writeFileSync(this.configFile, JSON.stringify(this.tokens), 'utf8')
  }

  getStoredToken(ip) {
    return this.tokens[ip];
  }

}

module.exports = new MiioProtocolHelper();
