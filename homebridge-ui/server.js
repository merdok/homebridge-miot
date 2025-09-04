const {
  HomebridgePluginUiServer
} = require('@homebridge/plugin-ui-utils');
const MiCloud = require('../lib/protocol/MiCloud');
const Errors = require("../lib/utils/Errors.js");
const Constants = require('../lib/constants/Constants.js');
const MiotSpecClassGenerator = require('../lib/tools/MiotSpecClassGenerator');
const MiotSpecFetcher = require('../lib/protocol/MiotSpecFetcher');
const Logger = require("../lib/utils/Logger");
const fs = require('fs').promises;

class UiServer extends HomebridgePluginUiServer {
  constructor() {
    // super must be called first
    super();

    this.onRequest('/get-all-devices', this.getAllDevices.bind(this));
    this.onRequest('/generate-device-class', this.generateDeviceClass.bind(this));
    this.onRequest('/get-device-metadata', this.getDeviceMetadata.bind(this));
    this.onRequest('/login-to-micloud', this.loginToMiCloud.bind(this));
    this.onRequest('/get-cashed-micloud-session', this.getCashedMiCloudSession.bind(this));

    // this.ready() must be called to let the UI know you are ready to accept api calls
    this.ready();
  }

  async getAllDevices(params) {
    const miCloud = new MiCloud(new Logger());
    miCloud.setRequestTimeout(10000); // timeout 10 seconds
    var devices = [];

    const username = params.username;
    const password = params.password;
    const verifyUrl = params.verifyUrl;
    const twoFaTicket = params.twoFaTicket;
    const isShowAll = !!params.isShowAll;

    // try to login
    if (verifyUrl && twoFaTicket) {
      try {
        await miCloud.loginTwoFa(verifyUrl, twoFaTicket);
      } catch (err) {
        return {
          success: false,
          error: `2FA login failed with error: ` + err.message
        };
      }
    } else {
      try {
        await miCloud.login(username, password);
      } catch (err) {
        if (err instanceof Errors.TwoFactorRequired) {
          return {
            success: false,
            error: 'Two factor authentication required, please visit the specified url and retry login.',
            url: err.notificationUrl
          }
        }

        return {
          success: false,
          error: err.message + `! The specified MiCloud login credentials might be incorrect or the account does not exist...`
        };
      }
    }

    let warningMsg = null;

    // list all device from all available countries
    for (const country of miCloud.availableCountries) {
      try {
        miCloud.setCountry(country);
        // prevent duplicate devices
        const allList = (await miCloud.getDevices()).filter(device => !devices.find(d => d.did === device.did));
        let validList = allList;
        if (!isShowAll) {
          // filter out device without an local ip and without ssid (most probably bluetooth devices)
          validList = allList.filter(device => device.localip && device.localip.length > 0 && device.ssid && device.ssid.length > 0);
        }
        validList.map(device => device.country = country);
        devices.push(...validList);
      } catch (err) {
        warningMsg = `Warning - Could not retrive device list from ${country} server. Message:  ${err.message}`
      }
    }

    return {
      success: true,
      warning: warningMsg,
      devices: devices.map(device => {
        return {
          name: device.name,
          ip: device.localip,
          token: device.token,
          model: device.model,
          deviceId: device.did,
          country: device.country
        }
      })
    }
  }

  async generateDeviceClass(params) {
    const storagePath = this.homebridgeStoragePath + '/miotSpecClassGenerator/devices/';
    const miotSpecClassGenerator = new MiotSpecClassGenerator(params.deviceModel, null, params.deviceName, null, params.isMiCloudRequired, storagePath);
    try {
      await miotSpecClassGenerator.generate();
      return {
        success: true,
        filePath: miotSpecClassGenerator.getOutputFilePath(),
        devType: miotSpecClassGenerator.getDeviceType()
      }
    } catch (err) {
      return {
        success: false,
        error: err.message
      }
    }
  }

  async getDeviceMetadata(params) {
    try {
      const result = await MiotSpecFetcher.fetchMiotSpecByModel(params.deviceModel, true);
      const {
        description,
        properties,
        actions,
        events
      } = result;
      return {
        success: true,
        metadata: {
          description,
          properties,
          actions,
          events
        }
      }
    } catch (err) {
      return {
        success: false,
        error: err.message
      }
    }
  }

  async loginToMiCloud(params) {
    const miCloud = new MiCloud(new Logger());
    miCloud.setRequestTimeout(10000); // timeout 10 seconds

    const username = params.username;
    const password = params.password;
    const verifyUrl = params.verifyUrl;
    const twoFaTicket = params.twoFaTicket;

    if (verifyUrl && twoFaTicket) {
      try {
        await miCloud.loginTwoFa(verifyUrl, twoFaTicket);
      } catch (err) {
        return {
          success: false,
          error: `2FA login failed with error: ` + err.message
        };
      }
    } else {
      try {
        await miCloud.login(username, password);
      } catch (err) {
        if (err instanceof Errors.TwoFactorRequired) {
          return {
            success: false,
            error: 'Two factor authentication required, please visit the specified url and retry login.',
            url: err.notificationUrl
          }
        }

        return {
          success: false,
          error: err.message + `! The specified MiCloud login credentials might be incorrect or the account does not exist...`
        };
      }
    }

    const serviceToken = miCloud.getServiceToken();

    // check if the output directory exists, if not then create it recursively
    try {
      const storagePath = this.homebridgeStoragePath + '/.miot_micloud/';
      await fs.access(storagePath)
    } catch (err) {
      await fs.mkdir(storagePath, {
        recursive: true
      });
    }

    try {
      const cashedMiCloudSessionFile = this.homebridgeStoragePath + Constants.MICLOUD_SESSION_CACHE_LOCATION;
      const fileContent = JSON.stringify(serviceToken);
      await fs.writeFile(cashedMiCloudSessionFile, fileContent, 'utf8');
    } catch (err) {
      return {
        success: false,
        error: `Failed to save Micloud session! Error: ` + err.message
      };
    }

    return {
      success: true
    }

  }

  async getCashedMiCloudSession(params) {
    const cashedMiCloudSessionFile = this.homebridgeStoragePath + Constants.MICLOUD_SESSION_CACHE_LOCATION;

    try {
      const cashedSession = await fs.readFile(cashedMiCloudSessionFile, 'utf8');
      if (cashedSession) {
        let cashedSessionParsed = JSON.parse(cashedSession);
        return {
          success: true,
          cashedSession: cashedSessionParsed
        }
      }
    } catch (err) {
      return {
        success: false,
        error: `Failed to get cashed MiCloud session: ` + err.message
      }
    }

  }

}

// start the instance of the class
(() => {
  return new UiServer;
})();
