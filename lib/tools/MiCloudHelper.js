const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');
const envPaths = require('env-paths');
const miotPaths = envPaths('miot');
const MiCloud = require('../protocol/MiCloud');
const Logger = require("../utils/Logger");
const Errors = require("../utils/Errors.js");
const Constants = require('../constants/Constants.js');
const TimeUtils = require('../utils/TimeUtils.js');


class MiCloudHelper {
  constructor() {
    this.miCloud = new MiCloud(new Logger());

    this.availableCountries = this.miCloud.availableCountries;

    this.countryToUse = 'cn';
    this.requestTimeout = 10000; // default timeout 10 seconds

    this.configDir = miotPaths.config;
    this.configFile = path.join(this.configDir, 'micloud.json');

    try {
      fs.mkdirSync(this.configDir, {
        recursive: true
      });
    } catch (error) {
      throw new Error(error);
    }

    try {
      this.micloud = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
    } catch (error) {
      this.micloud = {};
    }

    this.requestTimeout = this.getDefaultTimeout() || this.requestTimeout;

    this.miCloud.setServiceToken(this.getServiceToken());
    this.miCloud.setRequestTimeout(this.requestTimeout);
  }


  /*----------========== PUBLIC ==========----------*/

  async login(username, password) {
    if (this.miCloud.isLoggedIn()) {
      throw new Error(`Already logged in!`);
    }

    if ((!username || !password)) {
      throw new Error(`You must specify a username and password!`);
    }

    // try to login
    try {
      await this.miCloud.login(username, password);
      this.setServiceToken(this.miCloud.getServiceToken());
    } catch (err) {
      if (err instanceof Errors.TwoFactorRequired) {
        throw new Error(`Two factor authentication required, please use visit below url and retry login. Url: ${err.notificationUrl}`);
      } else {
        throw new Error(err.message);
      }
    }
  }

  async createQrLogin(locale) {
    return this.miCloud.createQrLogin(locale);
  }

  async pollQrLogin(lpUrl) {
    return this.miCloud.pollQrLogin(lpUrl);
  }

  async completeQrLogin(qrLoginData) {
    await this.miCloud.completeQrLogin(qrLoginData);
    this.setServiceToken(this.miCloud.getServiceToken());
  }

  logout() {
    this.setServiceToken(null);
  }

  isLoggedIn() {
    return this.miCloud.isLoggedIn();
  }

  async getDevice(deviceId) {
    return this.miCloud.getDevice(deviceId);
  }

  async getDevices() {
    return this.miCloud.getDevices();
  }

  async getProps(params) {
    return this.miCloud.miotGetProps(params);
  }

  async setProps(params) {
    return this.miCloud.miotSetProps(params);
  }

  async action(params) {
    return this.miCloud.miotAction(params);
  }

  setCountry(country) {
    let defaultCountry = this.getDefaultCountry();
    this.countryToUse = country || defaultCountry || 'cn';
    this.miCloud.setCountry(this.countryToUse);
  }

  getCountry() {
    return this.countryToUse;
  }

  getRequestTimeout() {
    return this.requestTimeout;
  }

  parseParams(params) {
    return params ? JSON.parse(params) : [];
  }


  /*----------========== STORAGE ==========----------*/

  //country
  async setDefaultCountry(country) {
    if (!country) {
      throw new Error(`Missing country!`);
    }

    this.micloud['defaultCountry'] = country;
    fs.writeFileSync(this.configFile, JSON.stringify(this.micloud), 'utf8');
  }

  getDefaultCountry() {
    return this.micloud['defaultCountry'];
  }

  //timeout
  async setDefaultTimeout(timeout) {
    if (!timeout) {
      throw new Error(`Missing timeout!`);
    }

    if (isNaN(timeout)) {
      throw new Error(`Timeout must be a number!`);
    }

    this.micloud['defaultTimeout'] = timeout;
    fs.writeFileSync(this.configFile, JSON.stringify(this.micloud), 'utf8');
    this.miCloud.setRequestTimeout(timeout);
  }

  getDefaultTimeout() {
    return this.micloud['defaultTimeout'];
  }

  //service token
  async setServiceToken(tokenJson) {
    this.micloud['serviceToken'] = tokenJson;
    fs.writeFileSync(this.configFile, JSON.stringify(this.micloud), 'utf8');
  }

  getServiceToken() {
    return this.micloud['serviceToken'];
  }

  getCliCachedSession() {
    return this.getServiceToken();
  }

  getHomebridgeCachedSession(homebridgeStoragePath) {
    if (!homebridgeStoragePath) {
      throw new Error(`Missing Homebridge storage path!`);
    }

    try {
      return JSON.parse(fs.readFileSync(this._getHomebridgeCachedSessionFile(homebridgeStoragePath), 'utf8'));
    } catch (err) {
      if (err.code === 'ENOENT') {
        return null;
      }
      throw err;
    }
  }

  getHomebridgeStoragePath(homebridgeStoragePath) {
    if (homebridgeStoragePath) {
      return homebridgeStoragePath;
    }

    const candidates = [
      '/var/lib/homebridge',
      path.join(os.homedir(), '.homebridge')
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }

    throw new Error(`Could not auto-detect Homebridge storage path. Please specify --homebridge-storage <path>. Common locations: /var/lib/homebridge (systemd), ~/.homebridge (user install).`);
  }

  setHomebridgeCachedSession(homebridgeStoragePath, tokenJson) {
    if (!homebridgeStoragePath) {
      throw new Error(`Missing Homebridge storage path!`);
    }
    if (!tokenJson) {
      throw new Error(`Missing MiCloud service token!`);
    }

    const storagePath = path.join(homebridgeStoragePath, '.miot_micloud');
    fs.mkdirSync(storagePath, {
      recursive: true
    });
    fs.writeFileSync(this._getHomebridgeCachedSessionFile(homebridgeStoragePath), JSON.stringify(tokenJson), 'utf8');
  }

  clearHomebridgeCachedSession(homebridgeStoragePath) {
    if (!homebridgeStoragePath) {
      throw new Error(`Missing Homebridge storage path!`);
    }

    try {
      fs.unlinkSync(this._getHomebridgeCachedSessionFile(homebridgeStoragePath));
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }
  }

  getSessionMetadata(tokenJson) {
    if (!tokenJson) {
      return null;
    }

    const metadata = {
      loggedInAt: tokenJson.loggedInAt || 'unknown',
      displayLoggedInAt: TimeUtils.getSessionLoginTime(tokenJson),
      loginMethod: tokenJson.loginMethod || Constants.LOGIN_METHOD.UNKNOWN,
      timestamp: typeof tokenJson.timestamp === 'number' ? tokenJson.timestamp : null,
      age: typeof tokenJson.timestamp === 'number' ? this._formatAge(Date.now() - tokenJson.timestamp) : 'unknown',
      fields: {}
    };

    ['userId', 'ssecurity', 'serviceToken', 'cUserId', 'passToken', 'agentId', 'clientId'].forEach(field => {
      metadata.fields[field] = this._getRedactedFieldMetadata(tokenJson[field]);
    });

    return metadata;
  }

  async checkSession(tokenJson, country) {
    if (!tokenJson) {
      throw new Error(`Missing MiCloud service token!`);
    }

    const miCloud = new MiCloud(new Logger());
    miCloud.setServiceToken(tokenJson);
    miCloud.setRequestTimeout(this.requestTimeout);
    miCloud.setCountry(country || this.getDefaultCountry() || 'cn');

    const devices = await miCloud.getDevices();
    return {
      success: true,
      country: miCloud.country,
      deviceCount: Array.isArray(devices) ? devices.length : 0
    };
  }


  /*----------========== PRIVATE ==========----------*/

  _getHomebridgeCachedSessionFile(homebridgeStoragePath) {
    return path.join(homebridgeStoragePath, Constants.MICLOUD_SESSION_CACHE_LOCATION.replace(/^\//, ''));
  }

  _getRedactedFieldMetadata(value) {
    if (!value) {
      return {
        present: false,
        length: 0,
        sha256: null
      };
    }

    const stringValue = String(value);
    return {
      present: true,
      length: stringValue.length,
      sha256: crypto.createHash('sha256').update(stringValue).digest('hex').slice(0, 8)
    };
  }

  _formatAge(ageMs) {
    if (!Number.isFinite(ageMs) || ageMs < 0) {
      return 'unknown';
    }

    const totalMinutes = Math.floor(ageMs / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

}

module.exports = new MiCloudHelper();
