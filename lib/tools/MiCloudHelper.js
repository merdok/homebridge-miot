const path = require('path');
const fs = require('fs');
const envPaths = require('env-paths');
const miotPaths = envPaths('miot');
const MiCloud = require('../protocol/MiCloud');
const Logger = require("../utils/Logger");
const Errors = require("../utils/Errors.js");


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


  /*----------========== PRIVATE ==========----------*/


}

module.exports = new MiCloudHelper();
