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
    this.onRequest('/create-micloud-qr-login', this.createMiCloudQrLogin.bind(this));
    this.onRequest('/poll-micloud-qr-login', this.pollMiCloudQrLogin.bind(this));
    this.onRequest('/get-cached-micloud-session', this.getCachedMiCloudSession.bind(this));

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

    try {
      await this.saveCachedMiCloudSession(serviceToken);
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

  async createMiCloudQrLogin(params) {
    const miCloud = new MiCloud(new Logger());
    miCloud.setRequestTimeout(10000);

    try {
      const qrLogin = await miCloud.createQrLogin(params.locale || 'zh_CN');
      return {
        success: true,
        qr: qrLogin.qr,
        lp: qrLogin.lp,
        loginUrl: qrLogin.loginUrl,
        timeout: qrLogin.timeout,
        timeInterval: qrLogin.timeInterval
      };
    } catch (err) {
      return {
        success: false,
        error: `Failed to create MiCloud QR login: ` + err.message
      };
    }
  }

  async pollMiCloudQrLogin(params) {
    const miCloud = new MiCloud(new Logger());
    miCloud.setRequestTimeout(10000);

    try {
      const qrLoginData = await miCloud.pollQrLogin(params.lp);
      if (!qrLoginData.success) {
        return {
          success: false,
          pending: true,
          code: qrLoginData.code,
          desc: qrLoginData.desc
        };
      }

      await miCloud.completeQrLogin(qrLoginData);
      const serviceToken = miCloud.getServiceToken();
      await this.saveCachedMiCloudSession(serviceToken);

      return {
        success: true,
        cachedSession: {
          loggedInAt: serviceToken.loggedInAt,
          timestamp: serviceToken.timestamp
        }
      };
    } catch (err) {
      return {
        success: false,
        error: `Failed to complete MiCloud QR login: ` + err.message
      };
    }
  }

  async saveCachedMiCloudSession(serviceToken) {
    const storagePath = this.homebridgeStoragePath + '/.miot_micloud/';
    try {
      await fs.access(storagePath)
    } catch (err) {
      await fs.mkdir(storagePath, {
        recursive: true
      });
    }

    const cachedMiCloudSessionFile = this.homebridgeStoragePath + Constants.MICLOUD_SESSION_CACHE_LOCATION;
    const fileContent = JSON.stringify(serviceToken);
    await fs.writeFile(cachedMiCloudSessionFile, fileContent, 'utf8');
  }

  async getCachedMiCloudSession(params) {
    const cachedMiCloudSessionFile = this.homebridgeStoragePath + Constants.MICLOUD_SESSION_CACHE_LOCATION;

    try {
      const cachedSession = await fs.readFile(cachedMiCloudSessionFile, 'utf8');
      if (cachedSession) {
        let cachedSessionParsed = JSON.parse(cachedSession);
        return {
          success: true,
          cachedSession: cachedSessionParsed
        }
      }
    } catch (err) {
      return {
        success: false,
        error: `Failed to get cached MiCloud session: ` + err.message
      }
    }

  }

}

// start the instance of the class
(() => {
  return new UiServer;
})();
