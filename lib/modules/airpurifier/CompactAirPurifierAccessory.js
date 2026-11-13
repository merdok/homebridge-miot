const AirPurifierAccessory = require('./AirPurifierAccessory.js');

class CompactAirPurifierAccessory extends AirPurifierAccessory {
  initAccessoryObject() {
    super.initAccessoryObject();
    this.controlQueue = Promise.resolve();
    this.lastDisplayBrightness = 1;
  }

  setupMainAccessoryService() {
    super.setupMainAccessoryService();
    this.airPurifierService.setPrimaryService(true);
  }

  setupAdditionalAccessoryServices() {
    // Native Auto/Manual and speed replace the redundant mode switches.
    // Preserve the old Sleep switch subtype so its HomeKit identity survives.
    if (this.modeControl) {
      this.sleepService = this.createStatefulSwitch('Sleep', 'airPurifierModeService1',
        this.getSleep, this.setSleep);
      this.addAccessoryService(this.sleepService);
    }
    if (this.screenControl) {
      this.displayService = this.createStatefulSwitch('Display', 'compactDisplayService',
        this.getDisplay, this.setDisplay);
      this.addAccessoryService(this.displayService);
    }
    if (this.buzzerControl) {
      this.buzzerService = this.createStatefulSwitch('Buzzer', 'alarmAlarmService',
        this.getBuzzer, this.setBuzzer);
      this.addAccessoryService(this.buzzerService);
    }
    this.prepareAirQualityService(this.pm25Breakpoints);
    this.prepareFilterMaintenanceService();
    this.airPurifierService.addLinkedService(this.airQualityService);
    this.airPurifierService.addLinkedService(this.filterMaintenanceService);
    const C = this.api.hap.Characteristic;
    this.airQualityService.getCharacteristic(C.StatusFault).onGet(() => {
      this.assertReady();
      return this.getDevice().getFault() === 3 ? C.StatusFault.GENERAL_FAULT : C.StatusFault.NO_FAULT;
    });
  }

  assertReady() {
    if (!this.getDevice().isStateReady()) {
      throw new this.api.hap.HapStatusError(this.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  control(action) {
    // A speed change is a sequence of writes. Serialize controls so concurrent
    // Home requests cannot race the mode change or swallow device errors.
    const pending = this.controlQueue.then(async () => {
      this.assertReady();
      try { await action(); }
      catch (error) {
        this.logger.warn(`Purifier command failed: ${error.message}`);
        throw new this.api.hap.HapStatusError(this.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
      }
      this.updateAccessoryStatus();
    });
    this.controlQueue = pending.catch(() => {});
    return pending;
  }

  getAirPurifierActiveState() { this.assertReady(); return super.getAirPurifierActiveState(); }
  setAirPurifierActiveState(value) {
    return this.control(() => this.getDevice().setOn(value === this.api.hap.Characteristic.Active.ACTIVE));
  }

  getCurrentAirPurifierState() {
    this.assertReady();
    const C = this.api.hap.Characteristic.CurrentAirPurifierState;
    const d = this.getDevice();
    if (!d.isOn()) return C.INACTIVE;
    return d.getFault() === 2 || d.getSpeedNow() === 0 ? C.IDLE : C.PURIFYING_AIR;
  }

  getTargetAirPurifierState() { this.assertReady(); return super.getTargetAirPurifierState(); }
  setTargetAirPurifierState(value) {
    return this.control(() => value === this.api.hap.Characteristic.TargetAirPurifierState.AUTO
      ? this.getDevice().enableAutoMode() : this.getDevice().enableFavoriteMode());
  }

  getRotationSpeed() {
    this.assertReady();
    const d = this.getDevice();
    if (!d.isOn() || d.getFault() === 2) return 0;
    // Level 0 is the lowest running setting, not Off: map levels 0..14 to
    // fifteen positive percentages. In Auto/Sleep report measured RPM as a
    // fraction of the model's advertised 2500 RPM maximum, not the saved level.
    if (d.isFavoriteModeEnabled()) return Math.round((d.getFavoriteLevel() + 1) * 100 / 15);
    return Math.min(100, Math.max(0, Math.round(d.getSpeedNow() * 100 / 2500)));
  }

  setRotationSpeed(value) {
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      return Promise.reject(new this.api.hap.HapStatusError(this.api.hap.HAPStatus.INVALID_VALUE_IN_REQUEST));
    }
    return this.control(async () => {
      const d = this.getDevice();
      if (value === 0) return d.setOn(false);
      const level = Math.max(0, Math.min(14, Math.round(value * 15 / 100) - 1));
      // Apply the chosen level before entering Favorite, avoiding a brief jump
      // to a previously saved high speed.
      await d.setFavoriteLevel(level);
      await d.enableFavoriteMode();
      await d.setOn(true);
    });
  }

  getSleep() { this.assertReady(); return this.getDevice().isOn() && this.getDevice().isSleepModeEnabled(); }
  setSleep(value) {
    return this.control(async () => {
      const d = this.getDevice();
      if (value) { await d.enableSleepMode(); await d.setOn(true); }
      else if (d.isSleepModeEnabled()) await d.enableAutoMode();
    });
  }

  getDisplay() {
    this.assertReady();
    const brightness = this.getDevice().getPropertyValue(this.getDevice().screenBrightnessProp());
    if (brightness > 0) this.lastDisplayBrightness = brightness;
    return brightness > 0;
  }
  setDisplay(value) {
    return this.control(async () => {
      this.getDisplay(); // remember an externally selected dim/bright setting
      await this.getDevice().setPropertyValue(this.getDevice().screenBrightnessProp(), value ? this.lastDisplayBrightness : 0);
    });
  }
  getBuzzer() { this.assertReady(); return this.getDevice().getPropertyValue(this.getDevice().alarmProp()); }
  setBuzzer(value) { return this.control(() => this.getDevice().setPropertyValue(this.getDevice().alarmProp(), value)); }

  getLockPhysicalControlsState() { this.assertReady(); return super.getLockPhysicalControlsState(); }
  setLockPhysicalControlsState(value) {
    return this.control(() => this.getDevice().setChildLock(value === this.api.hap.Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED));
  }
  getFilterLifeLevel() { this.assertReady(); return super.getFilterLifeLevel(); }
  getFilterChangeIndicationState() { this.assertReady(); return super.getFilterChangeIndicationState(); }
  resetFilterIndication() { return this.control(() => this.getDevice().resetFilterLife()); }
  getAirQuality() {
    this.assertReady();
    return this.getDevice().getFault() === 3 ? this.api.hap.Characteristic.AirQuality.UNKNOWN : super.getAirQuality();
  }
  getPM25Density() {
    this.assertReady();
    if (this.getDevice().getFault() === 3) {
      throw new this.api.hap.HapStatusError(this.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
    return super.getPM25Density();
  }
  getAirQualityStatusActive() { return this.getDevice().isStateReady() && this.getDevice().getFault() !== 3; }

  updateAccessoryStatus() {
    const C = this.api.hap.Characteristic;
    const failed = () => new this.api.hap.HapStatusError(this.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    // Do not publish fabricated Off/zero values before the first read or after
    // loss of connectivity. A read then reports No Response to HomeKit.
    if (!this.getDevice().isStateReady()) {
      for (const service of this.getAccessory().services) {
        if (service.UUID === this.api.hap.Service.AccessoryInformation.UUID) continue;
        for (const characteristic of service.characteristics) {
          if (characteristic.getHandler) characteristic.updateValue(failed());
        }
      }
      return;
    }
    // Base update calls getPM25Density; sensor faults must be represented as an
    // error instead of a numeric measurement, without throwing from polling.
    const status = [
      [this.airPurifierService, C.Active, () => this.getAirPurifierActiveState()],
      [this.airPurifierService, C.CurrentAirPurifierState, () => this.getCurrentAirPurifierState()],
      [this.airPurifierService, C.TargetAirPurifierState, () => this.getTargetAirPurifierState()],
      [this.airPurifierService, C.RotationSpeed, () => this.getRotationSpeed()],
      [this.airPurifierService, C.FilterLifeLevel, () => this.getFilterLifeLevel()],
      [this.airPurifierService, C.FilterChangeIndication, () => this.getFilterChangeIndicationState()],
      [this.filterMaintenanceService, C.FilterLifeLevel, () => this.getFilterLifeLevel()],
      [this.filterMaintenanceService, C.FilterChangeIndication, () => this.getFilterChangeIndicationState()],
      [this.airQualityService, C.AirQuality, () => this.getAirQuality()],
      [this.airQualityService, C.PM2_5Density, () => this.getPM25Density()],
      [this.airQualityService, C.StatusActive, () => this.getAirQualityStatusActive()],
      [this.airQualityService, C.StatusFault, () => this.getDevice().getFault() === 3 ? C.StatusFault.GENERAL_FAULT : C.StatusFault.NO_FAULT],
      [this.sleepService, C.On, () => this.getSleep()],
      [this.displayService, C.On, () => this.getDisplay()],
      [this.buzzerService, C.On, () => this.getBuzzer()]
    ];
    if (this.childLockCharacteristic) status.push([this.airPurifierService, C.LockPhysicalControls, () => this.getLockPhysicalControlsState()]);
    for (const [service, type, read] of status) {
      if (!service) continue;
      let value;
      try { value = read(); } catch (error) { value = error; }
      service.getCharacteristic(type).updateValue(value);
    }
    this.updateAllCustomWrapperStatus();
    this.updateAllCustomServiceStatus();
  }
}

module.exports = CompactAirPurifierAccessory;
