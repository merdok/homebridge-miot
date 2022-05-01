let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseService = require('./BaseService.js');
const Constants = require('../constants/Constants.js');
const Events = require('../constants/Events.js');
const PropFormat = require('../constants/PropFormat.js');
const PropUnit = require('../constants/PropUnit.js');
const PropAccess = require('../constants/PropAccess.js');
const colorConvert = require('color-convert');


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
    return "Light";
  }


  /*----------========== SETUP SERVICE ==========----------*/

  prepareService() {
    if (!this._onProp()) {
      throw new Error(`The specified service has no 'on' property! Cannot create light service!`);
    }

    this.lightService = new Service.Lightbulb(this.getServiceName(), this.getServiceId());

    //on
    this.onCharacteristic = this.lightService.getCharacteristic(Characteristic.On)
      .onGet(this.isLightOn.bind(this))
      .onSet(this.setLightOn.bind(this));

    // properties to monitor
    this.addPropertyToMonitor(this._onProp());

    // react to property changes
    this._onProp().on(Events.PROP_VALUE_CHANGED, (prop) => {
      this.updateServiceStatus();
    });

    //additional characteristics
    //brightness
    this.setupBrightnessIfSupported();

    // color temperature
    this.setupColorTemperatureIfSupported();

    // color
    this.setupColorIfSupported();

    // add the service
    this.addAccessoryService(this.lightService);

    return true;
  }

  setupBrightnessIfSupported() {
    if (this.supportsBrightness()) {
      this.brightnessCharacteristic = this.lightService.addCharacteristic(new Characteristic.Brightness());
      this.brightnessCharacteristic
        .onGet(this.getLightBrightness.bind(this))
        .onSet(this.setLightBrightness.bind(this));

      this.addPropertyToMonitor(this._brightnessProp());

      this._brightnessProp().on(Events.PROP_VALUE_CHANGED, (prop) => {
        this.updateServiceStatus();
      });
    }
  }

  setupColorTemperatureIfSupported() {
    if (this.supportsColorTemperature()) {
      this.colorTemperatureCharacteristic = this.lightService.addCharacteristic(new Characteristic.ColorTemperature());
      this.colorTemperatureCharacteristic
        .onGet(this.getLightColorTemperature.bind(this))
        .onSet(this.setLightColorTemperature.bind(this))
        .setProps({
          minValue: this.getMinColorTempValue(),
          maxValue: this.getMaxColorTempValue()
        });

      this.addPropertyToMonitor(this._colorTemperatureProp());

      this._colorTemperatureProp().on(Events.PROP_VALUE_CHANGED, (prop) => {
        this.updateServiceStatus();
      });
    }
  }

  setupColorIfSupported() {
    if (this.supportsColor()) {
      this.hueCharacteristic = this.lightService.addCharacteristic(new Characteristic.Hue());
      this.hueCharacteristic
        .onGet(this.getLightColorHue.bind(this))
        .onSet(this.setLightColorHue.bind(this));

      this.saturationCharacteristic = this.lightService.addCharacteristic(new Characteristic.Saturation());
      this.saturationCharacteristic
        .onGet(this.getLightColorSaturation.bind(this))
        .onSet(this.setLightColorSaturation.bind(this));

      this.addPropertyToMonitor(this._colorProp());

      this._colorProp().on(Events.PROP_VALUE_CHANGED, (prop) => {
        this.updateServiceStatus();
      });
    }
  }


  /*----------========== STATE SETTERS/GETTERS ==========----------*/

  isLightOn() {
    if (this.isMiotDeviceConnected()) {
      return this.isOn();
    }
    return false;
  }

  setLightOn(value) {
    if (this.isMiotDeviceConnected()) {
      this.setOn(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getLightBrightness() {
    if (this.isMiotDeviceConnected()) {
      return this.getBrightness();
    }
    return 0;
  }

  setLightBrightness(brightness) {
    if (this.isMiotDeviceConnected()) {
      if (this.brightnessTimeout) clearTimeout(this.brightnessTimeout);
      this.brightnessTimeout = setTimeout(() => this.setBrightness(brightness), Constants.SLIDER_DEBOUNCE);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getLightColorTemperature() {
    if (this.isMiotDeviceConnected()) {
      return this.getColorTempMired();
    }
    return this.getMinColorTempValue();
  }

  setLightColorTemperature(colorTemp) {
    if (this.isMiotDeviceConnected()) {
      this.setColorTempMired(colorTemp);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getLightColorHue() {
    if (this.isMiotDeviceConnected()) {
      return this.getHue();
    }
    return 0;
  }

  setLightColorHue(hue) {
    if (this.isMiotDeviceConnected()) {
      this.setHue(hue);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getLightColorSaturation() {
    if (this.isMiotDeviceConnected()) {
      return this.getSaturation();
    }
    return 0;
  }

  setLightColorSaturation(saturation) {
    if (this.isMiotDeviceConnected()) {
      this.setSaturation(saturation);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  /*----------========== SERVICE PROTOCOL ==========----------*/

  updateServiceStatus() {
    if (this.onCharacteristic) this.onCharacteristic.updateValue(this.isLightOn());
    if (this.brightnessCharacteristic) this.brightnessCharacteristic.updateValue(this.getLightBrightness());
    if (this.colorTemperatureCharacteristic) this.colorTemperatureCharacteristic.updateValue(this.getLightColorTemperature());
    if (this.hueCharacteristic) this.hueCharacteristic.updateValue(this.getLightColorHue());
    if (this.saturationCharacteristic) this.saturationCharacteristic.updateValue(this.getLightColorSaturation());
  }


  /*----------========== SERVICE PROPERTIES ==========----------*/

  isOn() {
    return this.getPropertyValue(this._onProp());
  }

  async setOn(isOn) {
    return this.setPropertyValue(this._onProp(), isOn);
  }

  getBrightness() {
    return this.getPropertyValue(this._brightnessProp());
  }

  async setBrightness(value) {
    return this.setPropertyValue(this._brightnessProp(), value);
  }

  getColorTemperature() {
    return this.getPropertyValue(this._colorTemperatureProp());
  }

  async setColorTemperature(value) {
    return this.setPropertyValue(this._colorTemperatureProp(), value);
  }

  getColor() {
    return this.getPropertyValue(this._colorProp());
  }

  async setColor(value) {
    return this.setPropertyValue(this._colorProp(), value);
  }


  /*----------========== FEATURES ==========----------*/

  supportsBrightness() {
    return !!this._brightnessProp();
  }

  supportsColorTemperature() {
    return !!this._colorTemperatureProp();
  }

  supportsColor() {
    return !!this._colorProp();
  }


  /*----------========== CONVENIENCE ==========----------*/

  getColorTempMired() {
    let colorTempKelvin = this.getColorTemperature();
    if (colorTempKelvin > 0) {
      return Math.floor(1000000 / colorTempKelvin);
    }
    return this.getMinColorTempValue();
  }

  async setColorTempMired(miredVal) {
    if (miredVal > 0) {
      let kelvinVal = 1000000 / miredVal;
      kelvinVal = Math.floor(kelvinVal);
      this.setColorTemperature(kelvinVal);
    }
  }

  getHue() {
    return this.getColorHsv()[0];
  }

  getSaturation() {
    return this.getColorHsv()[1];
  }

  setHue(hue) {
    this.getLogger().debug(`[LightService] Setting hue to ${hue}`);
    this.setSaturationHue(undefined, hue);
  }

  setSaturation(saturation) {
    this.getLogger().debug(`[LightService] Setting saturation to ${saturation}`);
    this.setSaturationHue(saturation, undefined);
  }


  /*----------========== PROPERTIES ==========----------*/

  _onProp() {
    return this.getMiotService().getPropertyByType('on');
  }

  _brightnessProp() {
    return this.getMiotService().getPropertyByType('brightness');
  }

  _colorTemperatureProp() {
    return this.getMiotService().getPropertyByType('color-temperature');
  }

  _colorProp() {
    return this.getMiotService().getPropertyByType('color');
  }


  /*----------========== HELPERS ==========----------*/

  // color temp
  getMinColorTempValue() {
    let colorTempRange = this.getPropertyValueRange(this._colorTemperatureProp());
    let minVal = 140;
    if (colorTempRange && colorTempRange.length > 2) {
      minVal = colorTempRange[1];
      minVal = 1000000 / minVal;
    }
    return Math.floor(minVal);
  }

  getMaxColorTempValue() {
    let colorTempRange = this.getPropertyValueRange(this._colorTemperatureProp ());
    let maxVal = 500;
    if (colorTempRange && colorTempRange.length > 2) {
      maxVal = colorTempRange[0];
      maxVal = 1000000 / maxVal;
    }
    return Math.floor(maxVal);
  }

  // color
  setSaturationHue(saturation, hue) {
    if (!this.saturationHueToSet) {
      this.saturationHueToSet = {};
      // just in case if something went wrong, reset the variable
      setTimeout(() => {
        this.saturationHueToSet = null;
      }, 1000);
    }

    if (!this.saturationHueToSet.saturation && parseInt(saturation) >= 0) {
      this.saturationHueToSet.saturation = parseInt(saturation);
    }
    if (!this.saturationHueToSet.hue && parseInt(hue) >= 0) {
      this.saturationHueToSet.hue = parseInt(hue);
    }

    if (this.saturationHueToSet.saturation >= 0 && this.saturationHueToSet.hue >= 0) {
      let colorRgb = this.getColorRgb(this.saturationHueToSet.hue, this.saturationHueToSet.saturation, this.getBrightness());
      this.getLogger().debug(`[LightService] Got hue and saturation! Sending rgb ${colorRgb} value to device!`);
      this.saturationHueToSet = null;
      this.setColor(colorRgb);
    }
  }

  getColorHsv() {
    let colorRgb = this.getColor();
    if (colorRgb) {
      let r = colorRgb >> 16;
      let g = colorRgb >> 8 & 255;
      let b = colorRgb & 255;
      let color = colorConvert.rgb.hsv([r, g, b]);
      return color;
    }
    return [0, 0];
  }

  getColorRgb(hue, saturation, brightness) {
    const color = colorConvert.hsv.rgb([hue, saturation, brightness])
    const r = color[0];
    const g = color[1];
    const b = color[2];
    return 256 * 256 * r + 256 * g + b;
  }


}


module.exports = OutletService;
