let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class GenericAccessory extends BaseAccessory {
  constructor(name, device, uuid, config, api, logger) {

    if (new.target === GenericAccessory) {
      throw new Error("Cannot instantiate GenericAccessory directly!")
    }

    Service = api.hap.Service;
    Characteristic = api.hap.Characteristic;
    Accessory = api.platformAccessory;
    HapStatusError = api.hap.HapStatusError;
    HAPStatus = api.hap.HAPStatus;

    super(name, device, uuid, config, api, logger);
  }


  /*----------========== INIT ==========----------*/

  initAccessoryObject() {
    this.buzzerControl = this.getConfigValue('buzzerControl', true);
    this.ledControl = this.getConfigValue('ledControl', true);
    this.childLockControl = this.getConfigValue('childLockControl', true);
    this.modeControl = this.getConfigValue('modeControl', true);

    this.actionButtons = this.getConfigValue('actionButtons', false);
    this.propertyControl = this.getConfigValue('propertyControl', []);
    this.propertyMonitor = this.getConfigValue('propertyMonitor', []);

    super.initAccessoryObject();
  }


  /*----------========== ACCESSORY INFO ==========----------*/


  /*----------========== INIT ACCESSORIES ==========----------*/


  /*----------========== SETUP SERVICES ==========----------*/

  setupAdditionalAccessoryServices() {
    if (this.buzzerControl) this.prepareBuzzerControlService();
    if (this.ledControl) this.prepareLedControlService();
    if (this.modeControl) this.prepareModeControlServices();

    if (this.actionButtons) this.prepareActionButtonServices(this.actionButtons);
    if (this.propertyControl) this.preparePropertyControlervices(this.propertyControl);
    if (this.propertyMonitor) this.preparePropertyMonitorServices(this.propertyMonitor);

    this.prepareTemperatureService();
    this.prepareRelativeHumidityService();
    this.prepareBatteryService();
    this.prepareFilterMaintenanceService();

    super.setupAdditionalAccessoryServices();
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareBuzzerControlService() {
    if (this.getDevice().supportsBuzzerControl()) {
      this.addPropWrapper('Buzzer', this.getDevice().alarmProp(), null, null, null);
    }
  }

  prepareLedControlService() {
    if (this.getDevice().supportsIndicatorLightOnControl()) {
      this.addPropWrapper('Led', this.getDevice().indicatorLightOnProp(), null, null, null);
    } else if (this.getDevice().supportsIndicatorLightBrightnessControl()) {
      this.addPropWrapper('Led', this.getDevice().indicatorLightBrightnessProp(), null, null, null);
    } else if (this.getDevice().supportsIndicatorLightIndicatorLightControl()) {
      this.addPropWrapper('Led', this.getDevice().indicatorLightIndicatorLightProp(), null, null, null);
    }
  }

  prepareScreenControlService() {
    if (this.getDevice().supportsScreenOnControl()) {
      this.addPropWrapper('Screen', this.getDevice().screenOnProp(), null, null, null);
    } else if (this.getDevice().supportsScreenBrightnessControl()) {
      this.addPropWrapper('Screen', this.getDevice().screenBrightnessProp(), null, null, null);
    }
  }

  prepareOffDelayService() {
    if (this.getDevice().supportsOffDelay()) {
      this.addOffDelayWrapper('Off delay', this.getDevice().offDelayProp(), this.getDevice().onProp());
    }
  }

  prepareModeControlServices() {
    if (this.getDevice().supportsModes()) {
      this.addPropWrapper('Mode', this.getDevice().modeProp(), this.getDevice().onProp(), null, null);
    }
  }

  prepareFanLevelControlServices() {
    if (this.getDevice().supportsFanLevel()) {
      this.addPropWrapper('Fan Level', this.getDevice().fanLevelProp(), this.getDevice().onProp(), null, null);
    }
  }

  prepareIoniserControlService() {
    if (this.getDevice().supportsIoniser()) {
      this.addPropWrapper('Ioniser', this.getDevice().anionProp(), this.getDevice().onProp(), null);
    }
  }

  prepareTemperatureService() {
    if (this.getDevice().supportsTemperatureReporting()) {
      this.temperatureService = new Service.TemperatureSensor('Temperature', 'temperatureService');
      this.temperatureService
        .setCharacteristic(Characteristic.StatusFault, Characteristic.StatusFault.NO_FAULT)
        .setCharacteristic(Characteristic.StatusTampered, Characteristic.StatusTampered.NOT_TAMPERED);
      this.temperatureService
        .getCharacteristic(Characteristic.StatusActive)
        .onGet(this.getCurrentTemperatureStatusActive.bind(this));
      this.temperatureService
        .getCharacteristic(Characteristic.StatusLowBattery)
        .onGet(this.getStatusLowBatteryState.bind(this));
      this.temperatureService
        .getCharacteristic(Characteristic.CurrentTemperature)
        .onGet(this.getCurrentTemperature.bind(this));
      this.addAccessoryService(this.temperatureService);
    }
  }

  prepareRelativeHumidityService() {
    if (this.getDevice().supportsRelativeHumidityReporting()) {
      this.relativeHumidityService = new Service.HumiditySensor('Humidity', 'relativeHumidityService');
      this.relativeHumidityService
        .setCharacteristic(Characteristic.StatusFault, Characteristic.StatusFault.NO_FAULT)
        .setCharacteristic(Characteristic.StatusTampered, Characteristic.StatusTampered.NOT_TAMPERED);
      this.relativeHumidityService
        .getCharacteristic(Characteristic.StatusActive)
        .onGet(this.getCurrentRelativeHumidityStatusActive.bind(this));
      this.relativeHumidityService
        .getCharacteristic(Characteristic.StatusLowBattery)
        .onGet(this.getStatusLowBatteryState.bind(this));
      this.relativeHumidityService
        .getCharacteristic(Characteristic.CurrentRelativeHumidity)
        .onGet(this.getCurrentRelativeHumidity.bind(this));
      this.addAccessoryService(this.relativeHumidityService);
    }
  }

  prepareBatteryService() {
    if (this.getDevice().supportsBatteryLevelReporting() || this.getDevice().supportsChargingReporting()) {
      this.batteryService = new Service.BatteryService('Battery', 'batteryService');
      this.batteryService
        .getCharacteristic(Characteristic.StatusLowBattery)
        .onGet(this.getStatusLowBatteryState.bind(this));

      if (this.getDevice().supportsChargingReporting()) {
        this.batteryService
          .getCharacteristic(Characteristic.ChargingState)
          .onGet(this.getBatteryChargingState.bind(this));
      }

      if (this.getDevice().supportsBatteryLevelReporting()) {
        this.batteryService
          .getCharacteristic(Characteristic.BatteryLevel)
          .onGet(this.getBatteryLevel.bind(this));
      }

      this.addAccessoryService(this.batteryService);
    }
  }

  prepareFilterMaintenanceService() {
    if (this.getDevice().supportsFilterLifeLevelReporting()) {
      this.filterMaintenanceService = new Service.FilterMaintenance('Filter Maintenance', 'filterMaintenanceService');
      this.filterMaintenanceService
        .getCharacteristic(Characteristic.FilterChangeIndication)
        .onGet(this.getFilterChangeIndicationState.bind(this));
      this.filterMaintenanceService
        .addCharacteristic(Characteristic.FilterLifeLevel)
        .onGet(this.getFilterLifeLevel.bind(this));

      if (this.getDevice().supportsFilterLifeResetAction()) {
        this.filterMaintenanceService
          .getCharacteristic(Characteristic.ResetFilterIndication)
          .onSet(this.resetFilterIndication.bind(this));
      }

      this.addAccessoryService(this.filterMaintenanceService);
    }
  }

  prepareAirQualityService(pm25Breakpoints) {
    if (this.getDevice().supportsPm25DensityReporting()) {
      // setup the breakpoints
      this.preparePm25Breakpoints(pm25Breakpoints);

      this.airQualityService = new Service.AirQualitySensor('Air Quality', 'airQualityService');
      this.airQualityService
        .setCharacteristic(Characteristic.StatusFault, Characteristic.StatusFault.NO_FAULT)
        .setCharacteristic(Characteristic.StatusTampered, Characteristic.StatusTampered.NOT_TAMPERED);
      this.airQualityService
        .getCharacteristic(Characteristic.StatusLowBattery)
        .onGet(this.getStatusLowBatteryState.bind(this));
      this.airQualityService
        .getCharacteristic(Characteristic.StatusActive)
        .onGet(this.getAirQualityStatusActive.bind(this));
      this.airQualityService
        .getCharacteristic(Characteristic.AirQuality)
        .onGet(this.getAirQuality.bind(this));
      this.airQualityService
        .getCharacteristic(Characteristic.PM2_5Density)
        .onGet(this.getPM25Density.bind(this));

      if (this.getDevice().supportsAirQualityReporting() || this.getDevice().supportsTvocDensityReporting()) {
        this.airQualityService
          .getCharacteristic(Characteristic.VOCDensity)
          .onGet(this.getVOCDensity.bind(this));
      }

      if (this.getDevice().supportsPm10DensityReporting()) {
        this.airQualityService
          .getCharacteristic(Characteristic.PM10Density)
          .onGet(this.getPM10DensityChar.bind(this));
      }

      this.addAccessoryService(this.airQualityService);
    }
  }

  prepareCarbonDioxideService(co2AbnormalThreshold) {
    if (this.getDevice().supportsCo2DensityReporting()) {
      // setup the threshold
      this.prepareCo2AbnormalThreshold(co2AbnormalThreshold);

      this.carbonDioxideService = new Service.CarbonDioxideSensor('Carbon Dioxide', 'carbonDioxideService');
      this.carbonDioxideService
        .setCharacteristic(Characteristic.StatusFault, Characteristic.StatusFault.NO_FAULT)
        .setCharacteristic(Characteristic.StatusTampered, Characteristic.StatusTampered.NOT_TAMPERED);
      this.carbonDioxideService
        .getCharacteristic(Characteristic.StatusLowBattery)
        .onGet(this.getStatusLowBatteryState.bind(this));
      this.carbonDioxideService
        .getCharacteristic(Characteristic.StatusActive)
        .onGet(this.getCarbonDioxideStatusActive.bind(this));
      this.carbonDioxideService
        .getCharacteristic(Characteristic.CarbonDioxideDetected)
        .onGet(this.getCarbonDioxideDetected.bind(this));
      this.carbonDioxideService
        .getCharacteristic(Characteristic.CarbonDioxideLevel)
        .onGet(this.getCarbonDioxideLevel.bind(this));

      this.addAccessoryService(this.carbonDioxideService);
    }
  }


  // ----- characteristics

  addLockPhysicalControlsCharacteristic(service) {
    if (this.childLockControl && this.getDevice().supportsChildLock() && service) {
      this.childLockCharacteristic = service.addCharacteristic(Characteristic.LockPhysicalControls);
      this.childLockCharacteristic
        .onGet(this.getLockPhysicalControlsState.bind(this))
        .onSet(this.setLockPhysicalControlsState.bind(this));
    }
  }

  addRotationSpeedCharacteristic(service) {
    if (this.getDevice().supportsRotationSpeed() && service) {
      this.rotationSpeedCharacteristic = service.addCharacteristic(Characteristic.RotationSpeed);
      this.rotationSpeedCharacteristic
        .onGet(this.getRotationSpeed.bind(this))
        .onSet(this.setRotationSpeed.bind(this));
    }
  }

  addCurrentTemperatureCharacteristic(service) {
    if (this.getDevice().supportsTemperatureReporting() && service) {
      this.currentTemperatureCharacteristic = service.getCharacteristic(Characteristic.CurrentTemperature);
      if (!this.currentTemperatureCharacteristic) {
        this.currentTemperatureCharacteristic = service.addCharacteristic(Characteristic.CurrentTemperature);
      }
      this.currentTemperatureCharacteristic
        .onGet(this.getCurrentTemperature.bind(this));
    }
  }

  addCurrentRelativeHumidityCharacteristic(service) {
    if (this.getDevice().supportsRelativeHumidityReporting() && service) {
      this.currentRelativeHumidityCharacteristic = service.getCharacteristic(Characteristic.CurrentRelativeHumidity);
      if (!this.currentRelativeHumidityCharacteristic) {
        this.currentRelativeHumidityCharacteristic = service.addCharacteristic(Characteristic.CurrentRelativeHumidity);
      }
      this.currentRelativeHumidityCharacteristic
        .onGet(this.getCurrentRelativeHumidity.bind(this));
    }
  }

  addFilterLifeLevelCharacteristic(service) {
    if (this.getDevice().supportsFilterLifeLevelReporting() && service) {
      this.filterChangeIndicationCharacteristic = service.addCharacteristic(Characteristic.FilterChangeIndication);
      this.filterChangeIndicationCharacteristic
        .onGet(this.getFilterChangeIndicationState.bind(this));

      this.filterLifeLevelCharacteristic = service.addCharacteristic(Characteristic.FilterLifeLevel);
      this.filterLifeLevelCharacteristic
        .onGet(this.getFilterLifeLevel.bind(this));
    }
  }


  // ----- actions

  prepareActionButtonServices(actionButtonsUserConfig) {
    if (this.getDevice().hasActions()) {
      this.actionSwitchServices = [];
      let actionNames = actionButtonsUserConfig;

      // if user specified true then use all actions
      if (actionNames && actionNames === true) {
        actionNames = this.getDevice().getAllActionNames();
      }

      // at this point we should have an array of actions, if not then something went wrong
      if (!actionNames || !Array.isArray(actionNames)) {
        this.getLogger().debug(`=A= Failed to create actions buttons...`);
        return;
      }

      this.getLogger().debug(`=A= Creating user specified action buttons!`);

      // create the action buttons
      actionNames.forEach((item, i) => {
        let actionName = item.action || item; // get the action name, if array of objects then get "action" else use the item
        let actionDisplayName = item.name || this.getDevice().getActionFriendlyName(actionName); // get name from "name" else get friendly name
        let actionId = actionName + 'ActionService' + i; // generate action id
        let paramValues = item.params || []; // get params from "params" or leave empty

        const action = this.getDevice().getAction(actionName);

        //only if action exists
        if (action) {
          const tmpActionSwitch = this.createStatlessSwitch(actionDisplayName, actionId, (value) => {
            this.setActionSwitchOn(value, actionName, paramValues);
          });
          this.actionSwitchServices[i] = tmpActionSwitch;
          this.addAccessoryService(tmpActionSwitch);
          this.getLogger().deepDebug(`=A= Successfully created action button for action: ${actionName}!`);
        } else {
          this.getLogger().warn(`=A= Action ${actionName} does not exist on this device. Skipping action button!`);
        }
      });
    }
  }


  // ----- property buttons

  preparePropertyControlervices(propertyControlUserConfig) {
    if (propertyControlUserConfig && Array.isArray(propertyControlUserConfig) && propertyControlUserConfig.length > 0) {
      this.getLogger().debug(`=P= Creating user specified property wrappers!`);
      // create the property buttons
      propertyControlUserConfig.forEach((userProp, i) => {
        let propName = userProp.property || userProp; // get the property name or id, if array of objects then get "property" else use the item
        let propDisplayName = userProp.name || this.getDevice().getPropertyFriendlyName(propName); // get name from "name" else get friendly name
        let propValue = userProp.value; // get the prop value to set
        let linkedPropName = userProp.linkedProperty; // get the linked prop
        let linkedPropValue = userProp.linkedPropertyValue; // get the linked prop value

        //if value specified then add the value to the display name
        if (propValue) {
          propDisplayName = `${propDisplayName} - ${propValue}`;
        }

        // get the actual properties
        let tmpProp = this.getDevice().getProperty(propName);
        let linkedProp = this.getDevice().getProperty(linkedPropName);

        // only if property exists
        if (tmpProp) {
          const tmpWrapper = this.addPropWrapper(propDisplayName, tmpProp, linkedProp, propValue, linkedPropValue);
          if (tmpWrapper) {
            this.getDevice().addPropertyToMonitor(tmpProp); // monitor the actual property if not yet monitored
            this.getLogger().deepDebug(`=P= Successfully created property control for property: ${propName}!`);
          }
        } else {
          this.getLogger().warn(`=P= Property ${propName} does not exist on this device. Skipping property control!`);
        }
      });
    }
  }

  // ----- property monitor

  preparePropertyMonitorServices(propertyMonitorUserConfig) {
    if (propertyMonitorUserConfig && Array.isArray(propertyMonitorUserConfig) && propertyMonitorUserConfig.length > 0) {
      this.getLogger().debug(`=M= Creating user specified property monitor wrappers!`);
      // create the property monitor items
      propertyMonitorUserConfig.forEach((userProp, i) => {
        let propName = userProp.property || userProp; // get the property name or id, if array of objects then get "property" else use the item
        let propDisplayName = userProp.name || this.getDevice().getPropertyFriendlyName(propName); // get name from "name" else get friendly name
        let propValue = userProp.value; // get the prop value to set
        let linkedPropName = userProp.linkedProperty; // get the linked prop
        let linkedPropValue = userProp.linkedPropertyValue; // get the linked prop value

        // get the actual properties
        let tmpProp = this.getDevice().getProperty(propName);
        let linkedProp = this.getDevice().getProperty(linkedPropName);

        // only if property exists
        if (tmpProp) {
          const tmpWrapper = this.addPropMonitorWrapper(propDisplayName, tmpProp, linkedProp, propValue, linkedPropValue);
          if (tmpWrapper) {
            this.getDevice().addPropertyToMonitor(tmpProp); // monitor the actual property if not yet monitored
            this.getLogger().deepDebug(`=M= Successfully created property monitor for property: ${propName}!`);
          }
        } else {
          this.getLogger().warn(`=M= Property ${propName} does not exist on this device. Skipping property monitor!`);
        }
      });
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  // temperature
  getCurrentTemperatureStatusActive() {
    if (this.isMiotDeviceConnected()) {
      return true
    }
    return false;
  }

  getCurrentTemperature() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getTemperature();
    }
    return 0;
  }

  // humidity
  getCurrentRelativeHumidityStatusActive() {
    if (this.isMiotDeviceConnected()) {
      return true
    }
    return false;
  }

  getCurrentRelativeHumidity() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getRelativeHumidity();
    }
    return 0;
  }

  // battery
  getStatusLowBatteryState() {
    if (this.getDevice().supportsBatteryLevelReporting()) {
      if (this.isMiotDeviceConnected()) {
        return this.getDevice().getBatteryLevel() > Constants.BATTERY_LOW_THRESHOLD ? Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL : Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW;
      }
    }
    return Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL;
  }

  getBatteryChargingState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isDeviceCharging() ? Characteristic.ChargingState.CHARGING : Characteristic.ChargingState.NOT_CHARGING;
    }
    return Characteristic.ChargingState.NOT_CHARGEABLE;
  }

  getBatteryLevel() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getBatteryLevel();
    }
    return 0;
  }

  // filter maintenance
  getFilterChangeIndicationState() {
    if (this.isMiotDeviceConnected()) {
      let lifeLevel = this.getDevice().getFilterLifeLevel();
      if (lifeLevel <= Constants.FILTER_CHANGE_INDICATION_THRESHOLD) {
        return Characteristic.FilterChangeIndication.CHANGE_FILTER;
      }
    }
    return Characteristic.FilterChangeIndication.FILTER_OK;
  }

  getFilterLifeLevel() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getFilterLifeLevel();
    }
    return 0;
  }

  resetFilterIndication(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().resetFilterLife();
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  // air quality
  getAirQualityStatusActive() {
    if (this.isMiotDeviceConnected()) {
      return true
    }
    return false;
  }

  getAirQuality() {
    if (this.isMiotDeviceConnected()) {
      let pm25Density = this.getDevice().getPm25Density();
      if (pm25Density <= this.excellentBreakpoint) {
        return Characteristic.AirQuality.EXCELLENT;
      } else if (pm25Density > this.excellentBreakpoint && pm25Density <= this.goodBreakpoint) {
        return Characteristic.AirQuality.GOOD;
      } else if (pm25Density > this.goodBreakpoint && pm25Density <= this.fairBreakpoint) {
        return Characteristic.AirQuality.FAIR;
      } else if (pm25Density > this.fairBreakpoint && pm25Density <= this.inferiorBreakpoint) {
        return Characteristic.AirQuality.INFERIOR;
      } else if (pm25Density > this.inferiorBreakpoint) {
        return Characteristic.AirQuality.POOR;
      }
    }
    return Characteristic.AirQuality.UNKNOWN;
  }

  getPM25Density() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getPm25Density();
    }
    return 0;
  }

  getVOCDensity() {
    if (this.isMiotDeviceConnected()) {
      if (this.getDevice().supportsAirQualityReporting()) {
        return this.getDevice().getAirQuality();
      } else if (this.getDevice().supportsTvocDensityReporting()) {
        return this.getDevice().getTvocDensity();
      }
    }
    return 0;
  }

  getPM10DensityChar() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getPm10Density();
    }
    return 0;
  }

  // carbon dioxide
  getCarbonDioxideStatusActive() {
    if (this.isMiotDeviceConnected()) {
      return true
    }
    return false;
  }

  getCarbonDioxideDetected() {
    if (this.isMiotDeviceConnected()) {
      let co2Density = this.getDevice().getCo2Density();
      if (co2Density > this.co2AbnormalThreshold) {
        return Characteristic.CarbonDioxideDetected.CO2_LEVELS_ABNORMAL;
      } else {
        return Characteristic.CarbonDioxideDetected.CO2_LEVELS_NORMAL;
      }
    }
    return Characteristic.CarbonDioxideDetected.CO2_LEVELS_NORMAL;
  }

  getCarbonDioxideLevel() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getCo2Density();
    }
    return 0;
  }


  // ----- characteristics

  getLockPhysicalControlsState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isChildLockActive() ? Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED : Characteristic.LockPhysicalControls.CONTROL_LOCK_DISABLED;
    }
    return Characteristic.LockPhysicalControls.CONTROL_LOCK_DISABLED;
  }

  setLockPhysicalControlsState(state) {
    if (this.isMiotDeviceConnected()) {
      let isChildLockActive = state === Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED;
      this.getDevice().setChildLock(isChildLockActive);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getRotationSpeed() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getRotationSpeedPercentage();
    }
    return 0;
  }

  setRotationSpeed(value) {
    if (this.isMiotDeviceConnected()) {
      // use debounce to limit the number of calls when the user slides the rotation slider
      if (this.rotationSpeedTimeout) clearTimeout(this.rotationSpeedTimeout);
      this.rotationSpeedTimeout = setTimeout(() => this.getDevice().setRotationSpeedPercentage(value), Constants.SLIDER_DEBOUNCE);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  // ----- actions

  setActionSwitchOn(state, actionName, paramValues = []) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().fireAction(actionName, paramValues);
      this.resetActionSwitches();
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  /*----------========== SERVICES STATUS ==========----------*/

  updateAccessoryStatus() {
    if (this.temperatureService) this.temperatureService.getCharacteristic(Characteristic.StatusActive).updateValue(this.getCurrentTemperatureStatusActive());
    if (this.temperatureService) this.temperatureService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(this.getCurrentTemperature());
    if (this.temperatureService) this.temperatureService.getCharacteristic(Characteristic.StatusLowBattery).updateValue(this.getStatusLowBatteryState());
    if (this.relativeHumidityService) this.relativeHumidityService.getCharacteristic(Characteristic.StatusActive).updateValue(this.getCurrentRelativeHumidityStatusActive());
    if (this.relativeHumidityService) this.relativeHumidityService.getCharacteristic(Characteristic.CurrentRelativeHumidity).updateValue(this.getCurrentRelativeHumidity());
    if (this.relativeHumidityService) this.relativeHumidityService.getCharacteristic(Characteristic.StatusLowBattery).updateValue(this.getStatusLowBatteryState());
    if (this.batteryService) this.batteryService.getCharacteristic(Characteristic.StatusLowBattery).updateValue(this.getStatusLowBatteryState());
    if (this.batteryService && this.getDevice().supportsChargingReporting()) this.batteryService.getCharacteristic(Characteristic.ChargingState).updateValue(this.getBatteryChargingState());
    if (this.batteryService && this.getDevice().supportsBatteryLevelReporting()) this.batteryService.getCharacteristic(Characteristic.BatteryLevel).updateValue(this.getBatteryLevel());
    if (this.filterMaintenanceService && this.getDevice().supportsFilterLifeLevelReporting()) this.filterMaintenanceService.getCharacteristic(Characteristic.FilterChangeIndication).updateValue(this.getFilterChangeIndicationState());
    if (this.filterMaintenanceService && this.getDevice().supportsFilterLifeLevelReporting()) this.filterMaintenanceService.getCharacteristic(Characteristic.FilterLifeLevel).updateValue(this.getFilterLifeLevel());
    if (this.airQualityService) this.airQualityService.getCharacteristic(Characteristic.StatusLowBattery).updateValue(this.getStatusLowBatteryState());
    if (this.airQualityService) this.airQualityService.getCharacteristic(Characteristic.StatusActive).updateValue(this.getAirQualityStatusActive());
    if (this.airQualityService) this.airQualityService.getCharacteristic(Characteristic.AirQuality).updateValue(this.getAirQuality());
    if (this.airQualityService) this.airQualityService.getCharacteristic(Characteristic.PM2_5Density).updateValue(this.getPM25Density());
    if (this.airQualityService && this.getDevice().supportsAirQualityReporting() || this.getDevice().supportsTvocDensityReporting()) this.airQualityService.getCharacteristic(Characteristic.VOCDensity).updateValue(this.getVOCDensity());
    if (this.airQualityService && this.getDevice().supportsPm10DensityReporting()) this.airQualityService.getCharacteristic(Characteristic.PM10Density).updateValue(this.getPM10DensityChar());
    if (this.carbonDioxideService) this.carbonDioxideService.getCharacteristic(Characteristic.StatusLowBattery).updateValue(this.getStatusLowBatteryState());
    if (this.carbonDioxideService) this.carbonDioxideService.getCharacteristic(Characteristic.StatusActive).updateValue(this.getCarbonDioxideStatusActive());
    if (this.carbonDioxideService) this.carbonDioxideService.getCharacteristic(Characteristic.CarbonDioxideDetected).updateValue(this.getCarbonDioxideDetected());
    if (this.carbonDioxideService) this.carbonDioxideService.getCharacteristic(Characteristic.CarbonDioxideLevel).updateValue(this.getCarbonDioxideLevel());

    if (this.childLockCharacteristic) this.childLockCharacteristic.updateValue(this.getLockPhysicalControlsState());
    if (this.rotationSpeedCharacteristic) this.rotationSpeedCharacteristic.updateValue(this.getRotationSpeed());
    if (this.currentTemperatureCharacteristic) this.currentTemperatureCharacteristic.updateValue(this.getCurrentTemperature());
    if (this.currentRelativeHumidityCharacteristic) this.currentRelativeHumidityCharacteristic.updateValue(this.getCurrentRelativeHumidity());
    if (this.filterChangeIndicationCharacteristic) this.filterChangeIndicationCharacteristic.updateValue(this.getFilterChangeIndicationState());
    if (this.filterLifeLevelCharacteristic) this.filterLifeLevelCharacteristic.updateValue(this.getFilterLifeLevel());

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/

  resetActionSwitches() {
    if (this.actionSwitchServices && this.actionSwitchServices.length > 0) {
      setTimeout(() => {
        this.actionSwitchServices.forEach((tmpActionSwitch, i) => {
          tmpActionSwitch.getCharacteristic(Characteristic.On).updateValue(false);
        });
      }, Constants.BUTTON_RESET_TIMEOUT);
    }
  }


  /*----------========== SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== STATELESS SWITCH SERVICES HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/

  preparePm25Breakpoints(pm25Breakpoints) {
    // make sure that the provided array is valid
    if (pm25Breakpoints) {
      if (!Array.isArray(pm25Breakpoints) || pm25Breakpoints.length != 4 ||
        pm25Breakpoints[0] >= pm25Breakpoints[1] || pm25Breakpoints[1] >= pm25Breakpoints[2] || pm25Breakpoints[2] >= pm25Breakpoints[3]) {
        this.getLogger().warn(`The value specified for the 'pm25Breakpoints' property is invalid! Reverting to default!`);
        pm25Breakpoints = [7, 15, 30, 55];
      }
    } else {
      pm25Breakpoints = [7, 15, 30, 55];
    }
    this.excellentBreakpoint = parseInt(pm25Breakpoints[0]);
    this.goodBreakpoint = parseInt(pm25Breakpoints[1]);
    this.fairBreakpoint = parseInt(pm25Breakpoints[2]);
    this.inferiorBreakpoint = parseInt(pm25Breakpoints[3]);
  }

  prepareCo2AbnormalThreshold(co2AbnormalThreshold) {
    // make sure that the value is valid
    if (!Number.isFinite(co2AbnormalThreshold)) {
      this.getLogger().warn(`The value specified for the 'co2AbnormalThreshold' property is invalid! Reverting to default!`);
      co2AbnormalThreshold = 1000;
    }
    this.co2AbnormalThreshold = co2AbnormalThreshold;
  }


  /*----------========== HELPERS ==========----------*/


}


module.exports = GenericAccessory;
