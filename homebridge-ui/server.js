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
    this.onRequest('/get-cached-micloud-session', this.getCachedMiCloudSession.bind(this));
    this.onRequest('/get-plugin-diagnostics', this.getPluginDiagnostics.bind(this));

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
    const storagePath = this.homebridgeStoragePath + '/.miot_micloud/';
    try {
      await fs.access(storagePath)
    } catch (err) {
      await fs.mkdir(storagePath, {
        recursive: true
      });
    }

    try {
      const cachedMiCloudSessionFile = this.homebridgeStoragePath + Constants.MICLOUD_SESSION_CACHE_LOCATION;
      const fileContent = JSON.stringify(serviceToken);
      await fs.writeFile(cachedMiCloudSessionFile, fileContent, 'utf8');
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

  async getPluginDiagnostics(params) {
    const logFile = this.homebridgeStoragePath + '/homebridge.log';
    const limit = Math.max(1, Math.min(parseInt(params.limit) || 30, 100));

    try {
      const logContent = await fs.readFile(logFile, 'utf8');
      const entries = logContent
        .split(/\r?\n/)
        .slice(-2000)
        .map(line => this._sanitizeDiagnosticLine(line))
        .filter(line => line.includes('[homebridge-miot]') || line.includes('[Homebridge UI] [homebridge-miot]'))
        .filter(line => this._isUsefulDiagnosticLine(line))
        .slice(-limit);

      return {
        success: true,
        status: this._summarizeDiagnostics(entries),
        entries
      };
    } catch (err) {
      return {
        success: false,
        error: `Failed to read Homebridge log: ` + err.message,
        status: {
          severity: 'unknown',
          title: 'Diagnostics unavailable',
          message: 'The UI could not read the Homebridge log file.'
        },
        entries: []
      };
    }

  }

  _isUsefulDiagnosticLine(line) {
    return /error|warn|failed|timeout|retrying|matter mode|micloud|not connected|cannot execute/i.test(line);
  }

  _sanitizeDiagnosticLine(line) {
    return String(line || '')
      .replace(/\x1B\[[0-9;]*m/g, '')
      .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email]')
      .replace(/("?(?:password|serviceToken|ssecurity|token)"?\s*[:=]\s*"?)[^",\s]+/gi, '$1[redacted]')
      .trim();
  }

  _summarizeDiagnostics(entries = []) {
    const lastConnectionError = [...entries].reverse().find(line => /handshake timeout|Call to device timed out|Could not connect to device/i.test(line));
    if (lastConnectionError) {
      return {
        severity: 'error',
        title: 'Local MIOT connection is timing out',
        message: 'A device is not responding to local MIOT requests. If this is a robot cleaner on another subnet or blocked by Wi-Fi isolation, switch it to MiCloud/HAP in the Matter setup section or fix local network reachability.'
      };
    }

    const matterFallback = [...entries].reverse().find(line => /Matter mode|Matter auto mode|Matter robot controls require local MIOT/i.test(line));
    if (matterFallback) {
      return {
        severity: 'warning',
        title: 'Matter fell back to HAP',
        message: 'Matter robot exposure requires local MIOT. The UI can switch the device between local Matter and MiCloud/HAP modes.'
      };
    }

    const lastError = [...entries].reverse().find(line => /error|failed|warn/i.test(line));
    if (lastError) {
      return {
        severity: 'warning',
        title: 'Recent plugin warning',
        message: lastError
      };
    }

    return {
      severity: 'success',
      title: 'No recent plugin errors',
      message: 'No actionable homebridge-miot errors were found in the recent Homebridge log.'
    };
  }

}

// start the instance of the class
(() => {
  return new UiServer;
})();
