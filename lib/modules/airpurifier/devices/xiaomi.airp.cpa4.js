const AirPurifierDevice = require('../AirPurifierDevice.js');
const CompactAirPurifierAccessory = require('../CompactAirPurifierAccessory.js');
const spec = require('../specs/xiaomi.airp.cpa4.json');

// This is the xiaomi-cpa4:2 variant. The older zhimi definition has different
// property names and filter-reset arguments, so it must not be used as an alias.
class XiaomiAirpCpa4 extends AirPurifierDevice {
  getDeviceName() { return 'Xiaomi Smart Air Purifier 4 Compact'; }
  getAccessoryClass() { return CompactAirPurifierAccessory; }
  getMiotSpecUrl() { return spec.specUrl; }
  initDeviceServices() { this.getMiotDevice().setMiotSpec(spec); }
  allPropRequestChunkSize() { return 3; }
  favoriteLevelProp() { return this.getProperty('custom-service:favorite-level'); }
  speedNowProp() { return this.getProperty('custom-service:motor-speed-rpm'); }
  resetFilterLifeAction() { return this.getAction('filter:reset-filter-life'); }

  devicePropertiesToMonitor() {
    return ['air-purifier:on', 'air-purifier:mode', 'air-purifier:fault',
      'custom-service:favorite-level', 'custom-service:motor-speed-rpm',
      'environment:pm2.5-density', 'filter:filter-life-level', 'filter:filter-used-time',
      'filter:filter-left-time', 'alarm:alarm',
      'physical-controls-locked:physical-controls-locked', 'screen:brightness'];
  }

  isStateReady() {
    return this.isConnected() && this.devicePropertiesToMonitor().every(name =>
      this.getProperty(name) && !this.getProperty(name).isValueInitial);
  }

  async setPropertyValue(propObj, value) {
    const property = this.getProperty(propObj);
    if (!property || !this.isConnected()) throw new Error('Purifier is not ready for this command');
    const adjusted = property.adjustValueToPropRange(value);
    // Commands must reach the device even if a poll cache has the same value.
    // Writing favorite-level also changes the firmware's mode, and a concurrent
    // poll can temporarily leave the cached mode stale.
    // Upstream setProperty logs and swallows errors. Surface them to HomeKit.
    const result = await this.getMiotDevice().setProperty(property, adjusted);
    if (!Array.isArray(result) || result.length !== 1 || result[0].code !== 0) {
      throw new Error(`Purifier did not accept ${property.getName()}`);
    }
    return result;
  }

  async resetFilterLife() {
    const result = await this.getMiotDevice().executeAction(this.resetFilterLifeAction(), []);
    if (!result || result.code !== 0) throw new Error('Purifier did not accept filter reset');
    await this.getMiotDevice().requestAllProperties();
    this.updateAccessoryStatus();
  }

  initialPropertyFetchDone() {
    this.logger.info(`Filter life: ${this.getFilterLifeLevel()}%; ${this.getFilterLeftTime()} days remaining; ${this.getFilterUsedTime()} hours used.`);
    this.allPropertiesUpdated();
  }

  allPropertiesUpdated() {
    const fault = this.getFault();
    if (fault !== this.lastReportedFault) {
      if (fault) this.logger.warn(`Purifier fault: ${fault === 2 ? 'motor stuck' : fault === 3 ? 'sensor lost' : fault}`);
      else if (this.lastReportedFault) this.logger.info('Purifier fault cleared');
      this.lastReportedFault = fault;
    }
  }
}

module.exports = XiaomiAirpCpa4;
