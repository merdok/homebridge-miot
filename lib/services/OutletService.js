let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseService = require('./BaseService.js');
const Constants = require('../constants/Constants.js');
const Events = require('../constants/Events.js');
const PropFormat = require('../constants/PropFormat.js');
const PropUnit = require('../constants/PropUnit.js');
const PropAccess = require('../constants/PropAccess.js');


class OutletService extends BaseService {
  constructor(serviceId, serviceName, miotService, device, accessory, api, logger) {

    Service = api.hap.Service;
    Characteristic = api.hap.Characteristic;
    Accessory = api.platformAccessory;
    HapStatusError = api.hap.HapStatusError;
    HAPStatus = api.hap.HAPStatus;

    super(serviceId, serviceName, miotService, device, accessory, api, logger);
  }


  /*----------========== SERVICE INFO ==========----------*/

  getServiceType() {
    return "Outlet";
  }


  /*----------========== SETUP SERVICE ==========----------*/

  prepareService() {
    if (!this._onProp()) {
      throw new Error(`The specified service has no 'on' property! Cannot create outlet service!`);
    }

    // create and register the accessory
    this.outletService = new Service.Outlet(this._getOutletName(), this.getServiceId());
    this.outletService
      .getCharacteristic(Characteristic.On)
      .onGet(this.isOutletOn.bind(this))
      .onSet(this.setOutletOn.bind(this));
    this.outletService
      .addCharacteristic(Characteristic.OutletInUse)
      .onGet(this.isOutletInUse.bind(this));

    this.addAccessoryService(this.outletService);

    // monitor service properties
    this.addPropertyToMonitor(this._onProp());

    // register on propery value changes
    this._onProp().on(Events.PROP_VALUE_CHANGED, (prop) => {
      this.updateServiceStatus();
    });

    return true;
  }


  /*----------========== STATE SETTERS/GETTERS ==========----------*/

  isOutletOn() {
    if (this.isMiotDeviceConnected()) {
      return this.isOn();
    }
    return false;
  }

  setOutletOn(state) {
    if (this.isMiotDeviceConnected()) {
      this.setOn(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  isOutletInUse() {
    if (this.isMiotDeviceConnected()) {
      return this.isOn();
    }
    return false;
  }


  /*----------========== SERVICE PROTOCOL ==========----------*/

  updateServiceStatus() {
    if (this.outletService) this.outletService.getCharacteristic(Characteristic.On).updateValue(this.isOutletOn());
    if (this.outletService) this.outletService.getCharacteristic(Characteristic.OutletInUse).updateValue(this.isOutletInUse());
  }


  /*----------========== SERVICE PROPERTIES ==========----------*/

  isOn() {
    return this.getPropertyValue(this._onProp());
  }

  async setOn(isOn) {
    return this.setPropertyValue(this._onProp(), isOn);
  }


  /*----------========== FEATURES ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== PROPERTIES ==========----------*/

  _onProp() {
    return this.getMiotService().getPropertyByType('on');
  }


  /*----------========== HELPERS ==========----------*/

  _getOutletName() {
    let outletName = this.getServiceName();
    if (!outletName) {
      outletName = this.getServiceDesc();
      if (outletName.toLowerCase().includes('usb')) {
        outletName = `USB`;
      } else {
        outletName = `Outlet ${this.getServiceSiid()}`;
      }
    }
    return outletName;
  }


}


module.exports = OutletService;
