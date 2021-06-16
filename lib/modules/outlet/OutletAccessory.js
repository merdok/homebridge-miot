let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const OutletProperties = require('./OutletProperties.js');


class OutletAccessory extends BaseAccessory {
  constructor(name, miotDevice, uuid, config, api, logger) {
    super(name, miotDevice, uuid, config, api, logger);
  }


  /*----------========== SETUP ACCESSORY ==========----------*/

  initHapConstants() {
    Service = this.api.hap.Service;
    Characteristic = this.api.hap.Characteristic;
    Accessory = this.api.platformAccessory;
    HapStatusError = this.api.hap.HapStatusError;
    HAPStatus = this.api.hap.HAPStatus;
  }

  initConfigProperties(config) {
    this.ledControl = this.getPropValue(config['ledControl'], true);
    this.actionButtons = this.getPropValue(config['actionButtons'], false);
    this.shutdownTimer = this.getPropValue(config['shutdownTimer'], false);
    this.offMemoryControl = this.getPropValue(config['offMemoryControl'], false);
  }

  getAccessoryType() {
    return DevTypes.OUTLET;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    return new Accessory(this.getName(), this.getUuid(), this.api.hap.Accessory.Categories.OUTLET);
  }

  setupMainAccessoryService() {
    this.outletService = new Service.Outlet(this.getName(), 'outletService');
    this.outletService
      .getCharacteristic(Characteristic.On)
      .onGet(this.isOutletOn.bind(this))
      .onSet(this.setOutletOn.bind(this));
    this.outletService
      .addCharacteristic(Characteristic.OutletInUse)
      .onGet(this.isOutletInUse.bind(this));

    this.addAccessoryService(this.outletService);
  }

  setupAdditionalAccessoryServices() {
    this.prepareOutletServices();
    if (this.ledControl) this.prepareLedControlService();
    if (this.actionButtons) this.prepareActionButtonServices(this.actionButtons);
    if (this.shutdownTimer) this.prepareShutdownTimerService();
    if (this.offMemoryControl) this.prepareOffMemoryService();
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareOutletServices() {
    if (this.getDevice().supportsOutletPower1()) {
      this.outletPower1Service = new Service.Outlet('Outlet 1', 'outletPower1Service');
      this.outletPower1Service
        .getCharacteristic(Characteristic.On)
        .onGet(this.isOutletPower1On.bind(this))
        .onSet(this.setOutletPower1On.bind(this));
      this.outletPower1Service
        .addCharacteristic(Characteristic.OutletInUse)
        .onGet(this.isOutlet1InUse.bind(this));
      this.addAccessoryService(this.outletPower1Service);
    }

    if (this.getDevice().supportsOutletPower2()) {
      this.outletPower2Service = new Service.Outlet('Outlet 2', 'outletPower2Service');
      this.outletPower2Service
        .getCharacteristic(Characteristic.On)
        .onGet(this.isOutletPower2On.bind(this))
        .onSet(this.setOutletPower2On.bind(this));
      this.outletPower2Service
        .addCharacteristic(Characteristic.OutletInUse)
        .onGet(this.isOutlet2InUse.bind(this));
      this.addAccessoryService(this.outletPower2Service);
    }

    if (this.getDevice().supportsOutletPower3()) {
      this.outletPower3Service = new Service.Outlet('Outlet 3', 'outletPower3Service');
      this.outletPower3Service
        .getCharacteristic(Characteristic.On)
        .onGet(this.isOutletPower3On.bind(this))
        .onSet(this.setOutletPower3On.bind(this));
      this.outletPower3Service
        .addCharacteristic(Characteristic.OutletInUse)
        .onGet(this.isOutlet3InUse.bind(this));
      this.addAccessoryService(this.outletPower3Service);
    }

    if (this.getDevice().supportsOutletPower4()) {
      this.outletPower4Service = new Service.Outlet('Outlet 4', 'outletPower4Service');
      this.outletPower4Service
        .getCharacteristic(Characteristic.On)
        .onGet(this.isOutletPower4On.bind(this))
        .onSet(this.setOutletPower4On.bind(this));
      this.outletPower4Service
        .addCharacteristic(Characteristic.OutletInUse)
        .onGet(this.isOutlet4InUse.bind(this));
      this.addAccessoryService(this.outletPower4Service);
    }

    if (this.getDevice().supportsUsbPower()) {
      this.usbPowerService = new Service.Outlet('USB', 'usbPowerService');
      this.usbPowerService
        .getCharacteristic(Characteristic.On)
        .onGet(this.isUsbPowerOn.bind(this))
        .onSet(this.setUsbPowerOn.bind(this));
      this.usbPowerService
        .addCharacteristic(Characteristic.OutletInUse)
        .onGet(this.isUsbInUse.bind(this));
      this.addAccessoryService(this.usbPowerService);
    }
  }

  prepareOffMemoryService() {
    if (this.getDevice().supportsOffMemory()) {
      this.addPropValueListService('Off Memory', OutletProperties.OFF_MEMORY, null);
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  isOutletOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isPowerOn();
    }
    return false;
  }

  setOutletOn(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setPowerOn(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  isOutletInUse() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isPowerOn();
    }
    return false;
  }


  // ----- additional services

  isOutletPower1On() {
    if (this.isMiotDeviceConnected() && this.getDevice().isPowerOn()) {
      return this.getDevice().isOutletPower1On();
    }
    return false;
  }

  setOutletPower1On(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setOutletPower1On(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  isOutlet1InUse() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isOutletPower1On();
    }
    return false;
  }

  isOutletPower2On() {
    if (this.isMiotDeviceConnected() && this.getDevice().isPowerOn()) {
      return this.getDevice().isOutletPower2On();
    }
    return false;
  }

  setOutletPower2On(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setOutletPower2On(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  isOutlet2InUse() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isOutletPower2On();
    }
    return false;
  }

  isOutletPower3On() {
    if (this.isMiotDeviceConnected() && this.getDevice().isPowerOn()) {
      return this.getDevice().isOutletPower3On();
    }
    return false;
  }

  setOutletPower3On(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setOutletPower3On(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  isOutlet3InUse() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isOutletPower3On();
    }
    return false;
  }

  isOutletPower4On() {
    if (this.isMiotDeviceConnected() && this.getDevice().isPowerOn()) {
      return this.getDevice().isOutletPower4On();
    }
    return false;
  }

  setOutletPower4On(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setOutletPower4On(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  isOutlet4InUse() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isOutletPower4On();
    }
    return false;
  }

  isUsbPowerOn() {
    if (this.isMiotDeviceConnected() && this.getDevice().isPowerOn()) {
      return this.getDevice().isUsbPowerOn();
    }
    return false;
  }

  setUsbPowerOn(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setUsbPowerOn(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  isUsbInUse() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isUsbPowerOn();
    }
    return false;
  }


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.outletService) this.outletService.getCharacteristic(Characteristic.On).updateValue(this.isOutletOn());
    if (this.outletService) this.outletService.getCharacteristic(Characteristic.OutletInUse).updateValue(this.isOutletInUse());

    if (this.outletPower1Service) this.outletPower1Service.getCharacteristic(Characteristic.On).updateValue(this.isOutletPower1On());
    if (this.outletPower1Service) this.outletPower1Service.getCharacteristic(Characteristic.OutletInUse).updateValue(this.isOutlet1InUse());
    if (this.outletPower2Service) this.outletPower2Service.getCharacteristic(Characteristic.On).updateValue(this.isOutletPower2On());
    if (this.outletPower2Service) this.outletPower2Service.getCharacteristic(Characteristic.OutletInUse).updateValue(this.isOutlet2InUse());
    if (this.outletPower3Service) this.outletPower3Service.getCharacteristic(Characteristic.On).updateValue(this.isOutletPower3On());
    if (this.outletPower3Service) this.outletPower3Service.getCharacteristic(Characteristic.OutletInUse).updateValue(this.isOutlet3InUse());
    if (this.outletPower4Service) this.outletPower4Service.getCharacteristic(Characteristic.On).updateValue(this.isOutletPower4On());
    if (this.outletPower4Service) this.outletPower4Service.getCharacteristic(Characteristic.OutletInUse).updateValue(this.isOutlet4InUse());
    if (this.usbPowerService) this.usbPowerService.getCharacteristic(Characteristic.On).updateValue(this.isUsbPowerOn());
    if (this.usbPowerService) this.usbPowerService.getCharacteristic(Characteristic.OutletInUse).updateValue(this.isUsbInUse());

    super.updateDeviceStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = OutletAccessory;
