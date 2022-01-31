const fs = require('fs').promises;
const MiCloud = require('../protocol/MiCloud');
const Logger = require("../utils/Logger");
const TwoFactorRequired = require("../utils/errors/TwoFactorRequired");


class MiCloudHelper {
  constructor() {
    this.miCloud = new MiCloud(new Logger());
    this.miCloud.setRequestTimeout(10000); // timeout 10 seconds

    this.availableCountries = this.miCloud.availableCountries;
  }


  /*----------========== PUBLIC ==========----------*/

  async login(username, password, file) {

    if (this.miCloud.isLoggedIn()) {
      throw new Error(`Already logged in!`);
    }

    if ((!username || !password) && !file) {
      throw new Error(`You must specify a username and password or a micloud.json file containing the credentials!`);
    }

    let micloudJson = null;

    if (file) {
      if (file.endsWith('/')) {
        file = file + 'micloud.json';
      }

      const deviceInfo = await fs.readFile(file, 'utf8');
      if (deviceInfo) {
        micloudJson = JSON.parse(deviceInfo);
        username = micloudJson.username;
        password = micloudJson.password;
      } else {
        throw new Error(`Could not read the credentials file at ${file}`);
      }
    }

    if (username && password) {
      // try to login
      try {
        await this.miCloud.login(username, password);
      } catch (err) {
        if (err instanceof TwoFactorRequired) {
          throw new Error(`Two factor authentication required, please use visit below url and retry login. Url: ${err.notificationUrl}`);
        } else {
          throw new Error(err.message);
        }
      }
    } else {
      throw new Error(`Missing username or password! Cannot login!`);
    }

  }

  async getDevice(deviceId) {
    return this.miCloud.getDevice(deviceId);
  }

  async getDevices() {
    return this.miCloud.getDevices();
  }

  setCountry(country = 'cn') {
    this.miCloud.setCountry(country);
  }

}

module.exports = new MiCloudHelper();
