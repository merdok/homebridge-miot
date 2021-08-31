const { HomebridgePluginUiServer } = require('@homebridge/plugin-ui-utils');
const MiCloud = require('../lib/protocol/MiCloud');
const TwoFactorRequired = require("../lib/utils/errors/TwoFactorRequired");
const Logger = require("../lib/utils/Logger");

class UiServer extends HomebridgePluginUiServer {
  constructor() {
    // super must be called first
    super();

    this.onRequest('/get-all-devices', this.getAllDevices.bind(this));

    // this.ready() must be called to let the UI know you are ready to accept api calls
    this.ready();
  }

  async getAllDevices(params) {
    const miCloud = new MiCloud(new Logger());
    miCloud.setRequestTimeout(10000); // timeout 10 seconds
    var devices = [];
    try {
      await miCloud.login(params.username, params.password);
      // list all device from all available countries
      for (const country of miCloud.availableCountries) {
        miCloud.setCountry(country);
        // prevent duplicate device
        const allList = (await miCloud.getDevices()).filter(device => !devices.find(d => d.did === device.did));
        // filter out device without an local ip and without ssid (most probably bluetooth devices)
        const validList = allList.filter(device => device.localip && device.localip.length > 0 && device.ssid && device.ssid.length > 0);
        devices.push(...validList);
      }

      return {
        success: true,
        devices: devices.map(device => {
          return {
            name: device.name,
            ip: device.localip,
            token: device.token,
            model: device.model,
            deviceId: device.did,
          }
        }),
      }
    } catch (err) {
      if (err instanceof TwoFactorRequired) {
        return {
          success: false,
          error: 'Two factor authentication required, please use visit below url and retry login.',
          url: err.notificationUrl,
        }
      }

      return {
        success: false,
        error: err.message,
      };
    }
  }
}

// start the instance of the class
(() => {
  return new UiServer;
})();
