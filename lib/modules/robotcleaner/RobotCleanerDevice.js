const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');
const Events = require('../../constants/Events.js');
const {
  parseRoomsFromUnknownPayload,
  parseMapIdsFromUnknownPayload
} = require('./RobotCleanerMatterUtils.js');

const COMMAND_ACTION = 'action';
const COMMAND_SET = 'set_properties';
const ROOM_DISCOVERY_PROPERTIES = [
  'map:room-id-name-list',
  'map:mijia-room-list',
  'order:room-data',
  'order:orderdata',
  'vacuum:room-ids'
];


class RobotCleanerDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
    this.legacyMiioSupported = false;
    this.legacyRoomMappingSupported = false;
  }

  async initDevice(propertyChunkSize) {
    await super.initDevice(propertyChunkSize);
    this.getMiotDevice().setLocalDeviceInfoReader(() => this._readLegacyMiioDeviceInfo());
    this.getMiotDevice().setLocalPropertyReader(params => this._readLegacyMiioProperties(params));
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
    // log the the main brush left time when supported
    if (this.supportsMainBrushLeftTimeReporting()) {
      this.logger.info(`Main brush left time: ${this.getMainBrushLeftTime()} hours.`);
    }
    // log the the main brush life level when supported
    if (this.supportsMainBrushLifeLevelReporting()) {
      this.logger.info(`Main brush life level: ${this.getMainBrushLifeLevel()}%.`);
    }
    // log the the side brush left time when supported
    if (this.supportsSideBrushLeftTimeReporting()) {
      this.logger.info(`Side brush left time: ${this.getSideBrushLeftTime()} hours.`);
    }
    // log the the side brush life level when supported
    if (this.supportsSideBrushLifeLevelReporting()) {
      this.logger.info(`Side brush life level: ${this.getSideBrushLifeLevel()}%.`);
    }
    // log the the filter life level when supported
    if (this.supportsFilterLifeLevelReporting()) {
      this.logger.info(`Filter life level: ${this.getFilterLifeLevel()}%.`);
    }
    // log the the filter used time when supported
    if (this.supportsFilterUsedTimeReporting()) {
      this.logger.info(`Filter used time: ${this.getFilterUsedTime()} hours.`);
    }
    // log the the total clean time when supported
    if (this.supportsTotalCleanTimeReporting()) {
      this.logger.info(`Total clean time: ${this.getTotalCleanTime()} ${this.totalCleanTimeUnit()}.`);
    }
    // log the the total clean times when supported
    if (this.supportsTotalCleanTimesReporting()) {
      this.logger.info(`Total cleaned: ${this.getTotalCleanTimes()} times.`);
    }
    // log the the total clean area when supported
    if (this.supportsTotalCleanAreaReporting()) {
      this.logger.info(`Total clean area: ${this.getTotalCleanArea()} m2.`);
    }
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.ROBOT_CLEANER;
  }

  getDeviceName() {
    return 'Unknown robot cleaner device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['vacuum:status', 'vacuum:mode', 'vacuum:fault', 'battery:battery-level',
      'battery:charging-state', 'brush-cleaner:brush-left-time', 'brush-cleaner:brush-life-level', 'filter:filter-life-level',
      'filter:filter-left-time', 'vacuum-extend:cleaning-time', 'vacuum-extend:cleaning-area', 'clean-logs:total-clean-time',
      'clean-logs:total-clean-times', 'clean-logs:total-clean-area', 'sweep:side-brush-hours', 'sweep:side-brush-life'
    ];
  }


  /*----------========== VALUES ==========----------*/

  statusSweepingValue() {
    return this.getValueForStatus('Sweeping', true);
  }

  statusIdleValue() {
    return this.getValueForStatus('Idle', true);
  }

  statusPausedValue() {
    return this.getValueForStatus('Paused', true);
  }

  statusErrorValue() {
    return this.getValueForStatus('Error', true);
  }

  statusGoChargingValue() {
    return this.getValueForStatus('Go Charging', true);
  }

  statusChargingValue() {
    return this.getValueForStatus('Charging', true);
  }

  statusChargingCompletedValue() {
    return this.getValueForStatus('Charging Completed', true);
  }

  statusMoppingValue() {
    return this.getValueForStatus('Mopping', true);
  }

  statusUpdatingValue() {
    return this.getValueForStatus('Updating', true);
  }

  statusUpgradingValue() {
    return this.getValueForStatus('Upgrading', true);
  }

  statusSleepValue() {
    return this.getValueForStatus('Sleep', true);
  }

  statusDryingValue() {
    return this.getValueForStatus('Drying', true);
  }

  statusWashingValue() {
    return this.getValueForStatus('Washing', true);
  }

  statusWashValue() {
    return this.getValueForStatus('Wash', true);
  }

  statusEmptyingValue() {
    return this.getValueForStatus('Emptying', true);
  }

  statusSweepingAndMoppingValue() {
    return this.getValueForStatus('Sweeping and Mopping', true);
  }


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  statusProp() {
    return this.getProperty('vacuum:status');
  }

  modeProp() {
    return this.getProperty('vacuum:mode');
  }

  faultProp() {
    return this.getProperty('vacuum:fault');
  }

  speedLevelProp() {
    return this.getProperty('vacuum:speed-level');
  }

  batteryLevelProp() {
    return this.getProperty('battery:battery-level');
  }

  batteryStateProp() {
    return this.getProperty('battery:charging-state');
  }

  //device specific
  mainBrushLeftTimeProp() {
    return this.getProperty('brush-cleaner:brush-left-time');
  }

  mainBrushLifeLevelProp() {
    return this.getProperty('brush-cleaner:brush-life-level');
  }

  sideBrushLeftTimeProp() {
    return this.getProperty('sweep:side-brush-hours');
  }

  sideBrushLifeLevelProp() {
    return this.getProperty('sweep:side-brush-life');
  }

  cleanTimeProp() {
    return this.getProperty('vacuum-extend:cleaning-time');
  }

  cleanAreaProp() {
    return this.getProperty('vacuum-extend:cleaning-area');
  }

  totalCleanTimeProp() {
    return this.getProperty('clean-logs:total-clean-time');
  }

  totalCleanTimesProp() {
    return this.getProperty('clean-logs:total-clean-times');
  }

  totalCleanAreaProp() {
    return this.getProperty('clean-logs:total-clean-area');
  }


  /*----------========== ACTIONS ==========----------*/

  startSweepAction() {
    return this.getAction('vacuum:start-sweep');
  }

  stopSweepAction() {
    return this.getAction('vacuum:stop-sweeping');
  }

  startRoomSweepAction() {
    return this.getAction('vacuum:start-room-sweep');
  }

  startChargeAction() {
    return this.getAction('battery:start-charge') || this.getAction('vacuum:start-charge');
  }

  startMopAction() {
    return this.getAction('vacuum:start-mop');
  }

  startSweepMopAction() {
    return this.getAction('vacuum:start-sweep-mop');
  }

  startOnlySweepAction() {
    return this.getAction('vacuum:start-only-sweep');
  }

  pauseSweepAction() {
    return this.getAction('vacuum:pause-sweeping') || this.getAction('vacuum:pause');
  }

  resumeSweepAction() {
    return this.getAction('vacuum:resume-sweeping') || this.getAction('vacuum:resume-clean') || this.getAction('vacuum:resume');
  }

  identifyAction() {
    return this.getAction('identify:identify') || this.getAction('device-information:identify');
  }

  audioPositionAction() {
    return this.getAction('audio:position');
  }

  audioPlaySoundAction() {
    return this.getAction('audio:play-sound');
  }

  viomiRoomCleanAction() {
    return this.getAction('viomi-vacuum:set-room-clean');
  }

  ijaiRoomCleanAction() {
    return this.getAction('sweep:set-room-clean');
  }

  dreameRoomCleanAction() {
    return this.getAction('vacuum-extend:start-clean') || this.getAction('clean:start-clean');
  }


  /*----------========== FEATURES ==========----------*/

  // main brush
  supportsMainBrushLeftTimeReporting() {
    return !!this.mainBrushLeftTimeProp();
  }

  supportsMainBrushLifeLevelReporting() {
    return !!this.mainBrushLifeLevelProp();
  }

  // side brush
  supportsSideBrushLeftTimeReporting() {
    return !!this.sideBrushLeftTimeProp();
  }

  supportsSideBrushLifeLevelReporting() {
    return !!this.sideBrushLifeLevelProp();
  }

  //last clean
  supportsLastCleanTime() {
    return !!this.cleanTimeProp();
  }

  supportsLastCleanArea() {
    return !!this.cleanAreaProp();
  }


  // totals
  supportsTotalCleanTimeReporting() {
    return !!this.totalCleanTimeProp();
  }

  totalCleanTimeUnit() {
    return this.supportsTotalCleanTimeReporting() ? this.getPropertyUnit(this.totalCleanTimeProp()) : PropUnit.HOURS;
  }

  supportsTotalCleanTimesReporting() {
    return !!this.totalCleanTimesProp();
  }

  supportsTotalCleanAreaReporting() {
    return !!this.totalCleanAreaProp();
  }

  supportsMopCleaning() {
    return !!this.startMopAction();
  }

  supportsCombinedCleaning() {
    return !!this.startSweepMopAction();
  }

  supportsRoomCleaning() {
    return !!(this.startRoomSweepAction() || this.viomiRoomCleanAction() || this.ijaiRoomCleanAction() || this.dreameRoomCleanAction() || this.legacyRoomMappingSupported);
  }

  supportsRoomDiscovery() {
    return this.legacyRoomMappingSupported ||
      !!this.getAction('map:get-map-room-list') ||
      ROOM_DISCOVERY_PROPERTIES.some(propName => {
        const prop = this.getProperty(propName);
        return prop && prop.isReadable();
      });
  }

  supportsIdentify() {
    return !!(this.identifyAction() || this.audioPositionAction() || this.audioPlaySoundAction() || this.alarmProp() || this.legacyMiioSupported);
  }


  /*----------========== GETTERS ==========----------*/

  getMainBrushLeftTime() {
    return this.getPropertyValue(this.mainBrushLeftTimeProp());
  }

  getMainBrushLifeLevel() {
    return this.getPropertyValue(this.mainBrushLifeLevelProp());
  }

  getSideBrushLeftTime() {
    return this.getPropertyValue(this.sideBrushLeftTimeProp());
  }

  getSideBrushLifeLevel() {
    return this.getPropertyValue(this.sideBrushLifeLevelProp());
  }

  getLastCleanTime() {
    return this.getPropertyValue(this.cleanTimeProp());
  }

  getLastCleanArea() {
    return this.getPropertyValue(this.cleanAreaProp());
  }

  getTotalCleanTime() {
    return this.getPropertyValue(this.totalCleanTimeProp());
  }

  getTotalCleanTimes() {
    return this.getPropertyValue(this.totalCleanTimesProp());
  }

  getTotalCleanArea() {
    return this.getPropertyValue(this.totalCleanAreaProp());
  }


  /*----------========== SETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  async setSweepActive(active) {
    if (active) {
      return this.fireAction(this.startSweepAction());
    } else {
      //  this.fireAction(this.stopSweepAction()); // this just pauses the robot
      return this.fireAction(this.startChargeAction()); // this forces the robot to go back to the dock even during cleaning
    }
  }

  async startCleaning(options = {}) {
    const { vacuum = true, mop = false } = options;
    const action = vacuum && mop
      ? this.startSweepMopAction()
      : mop
        ? this.startMopAction()
        : vacuum
          ? this.startOnlySweepAction() || this.startSweepAction()
          : null;

    if (action) {
      try {
        return await this.fireActionStrict(action);
      } catch (err) {
        this.logger.debug(`Robot cleaner start action failed: ${err.message}`);
      }
    }

    if (vacuum && !mop) {
      return this.executeMethodStrict('app_start', []);
    }
    throw new Error(`The requested cleaning mode is not supported by this robot.`);
  }

  async startRoomCleaning(roomIds = [], options = {}) {
    const { vacuum = true, mop = false } = options;
    const normalizedRoomIds = roomIds.map(roomId => String(roomId)).filter(roomId => roomId.length > 0);
    if (normalizedRoomIds.length === 0) {
      return this.startCleaning(options);
    }

    const roomIdString = normalizedRoomIds.join(',');
    if (this.startRoomSweepAction()) {
      return this.fireActionStrict(this.startRoomSweepAction(), [roomIdString]);
    }
    if (this.viomiRoomCleanAction()) {
      return this.fireActionStrict(this.viomiRoomCleanAction(), [0, 1, roomIdString]);
    }
    if (this.ijaiRoomCleanAction()) {
      return this.fireActionStrict(this.ijaiRoomCleanAction(), [roomIdString, 0, 1]);
    }
    if (this.dreameRoomCleanAction()) {
      const selects = normalizedRoomIds.map((roomId, i) => [Number(roomId) || roomId, 1, 1, 1, i + 1]);
      return this.fireActionStrict(this.dreameRoomCleanAction(), [
        JSON.stringify({ selects }),
        { piid: 1, value: 18 }
      ]);
    }
    try {
      return await this.executeMethodStrict('app_segment_clean', [{
        clean_mop: mop && !vacuum ? 1 : 0,
        segments: normalizedRoomIds.map(roomId => Number(roomId) || roomId),
        repeat: 1,
        clean_order_mode: 0
      }]);
    } catch (err) {
      this.logger.debug(`Robot cleaner segment method is unavailable: ${err.message}`);
    }

    throw new Error(`Room cleaning is not supported by this robot.`);
  }

  async pauseCleaning() {
    if (this.pauseSweepAction()) {
      try {
        return await this.fireActionStrict(this.pauseSweepAction());
      } catch (err) {
        this.logger.debug(`Robot cleaner pause action failed: ${err.message}`);
      }
    }
    return this.executeMethodStrict('app_pause', []);
  }

  async resumeCleaning(options = {}) {
    if (this.resumeSweepAction()) {
      return this.fireActionStrict(this.resumeSweepAction());
    }
    return this.startCleaning(options);
  }

  async goHome() {
    if (this.startChargeAction()) {
      try {
        return await this.fireActionStrict(this.startChargeAction());
      } catch (err) {
        this.logger.debug(`Robot cleaner charge action failed: ${err.message}`);
      }
    }
    return this.executeMethodStrict('app_charge', []);
  }

  async identify() {
    const actionAttempts = [
      this.identifyAction(),
      this.audioPositionAction(),
      this.audioPlaySoundAction()
    ].filter(action => action);
    let lastError = null;

    for (const action of actionAttempts) {
      try {
        return await this.fireActionStrict(action);
      } catch (err) {
        lastError = err;
        this.logger.debug(`Robot cleaner identify action ${action.getName()} failed: ${err.message}`);
      }
    }

    const alarmProp = this.alarmProp();
    if (alarmProp) {
      try {
        return await this.setPropertyValueStrict(alarmProp, 1);
      } catch (err) {
        lastError = err;
        this.logger.debug(`Robot cleaner identify alarm fallback failed: ${err.message}`);
      }
    }

    try {
      return await this.executeMethodStrict('find_me', []);
    } catch (err) {
      lastError = err;
      this.logger.debug(`Robot cleaner identify method is unavailable: ${err.message}`);
    }

    throw new Error(`Identify is not supported by this robot.${lastError ? ` Last error: ${lastError.message}` : ''}`);
  }

  isVacuumWorking() {
    return this.isStatusSweeping() || this.isStatusSweepingAndMopping() || this.isStatusMopping();
  }

  getOperationalStateFlags() {
    const isCharging = this.isStatusCharging();
    const isDocked = this.isStatusChargingCompleted();
    const isFullyCharged = isDocked || (isCharging && this.hasKnownBatteryLevel() && Number(this.getBatteryLevel()) >= 100);

    return {
      hasFault: this.supportsFaultReporting() && this.getFault() > 0,
      isError: this.isStatusError(),
      isWorking: this.isVacuumWorking(),
      isPaused: this.isStatusPause(),
      isGoCharging: this.isStatusGoCharging(),
      isFullyCharged,
      isCharging,
      isDocked,
      isEmptyingDustBin: this.isStatusEmptying(),
      isCleaningMop: this.isStatusWash() || this.isStatusWashing() || this.isStatusDrying(),
      isUpdatingMaps: this.isStatusUpdating() || this.isStatusUpgrading()
    };
  }

  hasKnownBatteryLevel() {
    const batteryLevelProp = this.batteryLevelProp();
    if (!batteryLevelProp || batteryLevelProp.isValueInitial) {
      return false;
    }

    const batteryPercent = this.getBatteryLevel();
    return batteryPercent !== null && batteryPercent !== undefined && batteryPercent !== '' && Number.isFinite(Number(batteryPercent));
  }


  /*----------========== VALUE CONVENIENCE  ==========----------*/

  isStatusSweeping() {
    return this.statusContainsOrEqualsValue(this.statusSweepingValue());
  }

  isStatusSweepingAndMopping() {
    return this.statusContainsOrEqualsValue(this.statusSweepingAndMoppingValue());
  }

  isStatusMopping() {
    return this.statusContainsOrEqualsValue(this.statusMoppingValue());
  }

  isStatusPause() {
    return this.statusContainsOrEqualsValue(this.statusPausedValue());
  }

  isStatusError() {
    return this.statusContainsOrEqualsValue(this.statusErrorValue());
  }

  isStatusGoCharging() {
    return this.statusContainsOrEqualsValue(this.statusGoChargingValue());
  }

  isStatusCharging() {
    return this.statusContainsOrEqualsValue(this.statusChargingValue());
  }

  isStatusChargingCompleted() {
    return this.statusContainsOrEqualsValue(this.statusChargingCompletedValue());
  }

  isStatusSleep() {
    return this.statusContainsOrEqualsValue(this.statusSleepValue());
  }

  isStatusUpdating() {
    return this.statusContainsOrEqualsValue(this.statusUpdatingValue());
  }

  isStatusUpgrading() {
    return this.statusContainsOrEqualsValue(this.statusUpgradingValue());
  }

  isStatusDrying() {
    return this.statusContainsOrEqualsValue(this.statusDryingValue());
  }

  isStatusWashing() {
    return this.statusContainsOrEqualsValue(this.statusWashingValue());
  }

  isStatusWash() {
    return this.statusContainsOrEqualsValue(this.statusWashValue());
  }

  isStatusEmptying() {
    return this.statusContainsOrEqualsValue(this.statusEmptyingValue());
  }

  getDockStatusValues() {
    let dockStatusVals = [];
    dockStatusVals = this._mergeValueOrArrayIntoArray(dockStatusVals, this.statusChargingValue());
    dockStatusVals = this._mergeValueOrArrayIntoArray(dockStatusVals, this.statusUpdatingValue());
    dockStatusVals = this._mergeValueOrArrayIntoArray(dockStatusVals, this.statusUpgradingValue());
    dockStatusVals = this._mergeValueOrArrayIntoArray(dockStatusVals, this.statusWashValue());
    dockStatusVals = this._mergeValueOrArrayIntoArray(dockStatusVals, this.statusEmptyingValue());
    dockStatusVals = this._mergeValueOrArrayIntoArray(dockStatusVals, this.statusWashingValue());
    dockStatusVals = this._mergeValueOrArrayIntoArray(dockStatusVals, this.statusDryingValue());
    dockStatusVals = this._mergeValueOrArrayIntoArray(dockStatusVals, this.statusChargingCompletedValue());
    return dockStatusVals;
  }

  /*----------========== HELPERS ==========----------*/

  _mergeValueOrArrayIntoArray(targetArr = [], source) {
    if (source != null && source !== -1) { // -1 is returned when the value is not found
      if (!Array.isArray(source)) {
        source = [source];
      }
      return [...targetArr, ...source];
    }
    return targetArr;
  }

  async discoverRooms() {
    const roomResults = [];

    roomResults.push(...await this._tryDiscoverMapActionRooms());
    roomResults.push(...await this._tryDiscoverLegacyRooms());
    roomResults.push(...this._discoverRoomsFromCachedProperties());

    return this._dedupeRooms(roomResults);
  }

  async detectLocalCapabilities() {
    if (!this.isLocallyConnected()) {
      return;
    }
    if (!this.legacyMiioSupported) {
      try {
        await this._readLegacyMiioStatus();
      } catch (err) {
        this.logger.deepDebug(`Legacy robot status method is unavailable: ${err.message}`);
      }
    }
    try {
      await this.executeMethodStrict('get_room_mapping', []);
      this.legacyRoomMappingSupported = true;
    } catch (err) {
      this.logger.deepDebug(`Legacy room-mapping method is unavailable: ${err.message}`);
    }
  }

  async fireActionStrict(actionObj, paramValues = []) {
    const action = this.getAction(actionObj);
    if (!action) {
      throw new Error(`Missing action. Cannot execute robot cleaner command.`);
    }
    if (!this.isLocallyConnected()) {
      throw new Error(`Cannot execute action ${action.getName()} because the robot is not connected locally.`);
    }

    const miotDevice = this.getMiotDevice();
    const actionDef = action.getProtocolAction(miotDevice.getDeviceId(), paramValues, miotDevice.isParseActionParams());
    this.logger.deepDebug(`Send strict robot cleaner action! RAW: ${JSON.stringify(actionDef)}`);
    const result = await this._sendLocalMiot(COMMAND_ACTION, actionDef);
    action.setLastResult(result);

    if (miotDevice._isResponseValid(result)) {
      this.logger.debug(`Successfully executed strict action ${action.getName()} with params ${JSON.stringify(paramValues)}! Result: ${JSON.stringify(result)}`);
      miotDevice.emit(Events.MIOT_DEVICE_ACTION_EXECUTED, action);
      return result;
    }

    throw new Error(`Error while executing action ${action.getName()} with params ${JSON.stringify(paramValues)}. Response: ${JSON.stringify(result)}`);
  }

  async setPropertyValueStrict(propObj, value) {
    const prop = this.getProperty(propObj);
    if (!prop) {
      throw new Error(`Missing property. Cannot set robot cleaner property.`);
    }
    if (!prop.isWritable()) {
      throw new Error(`Cannot set property ${prop.getName()} because it is not writable.`);
    }
    if (!this.isLocallyConnected()) {
      throw new Error(`Cannot set property ${prop.getName()} because the robot is not connected locally.`);
    }

    const adjustedValue = prop.adjustValueToPropRange(value);
    const miotDevice = this.getMiotDevice();
    const propDef = prop.getWriteProtocolObjForDid(miotDevice.getDeviceId(), adjustedValue);
    this.logger.deepDebug(`Set strict robot cleaner property! RAW: ${JSON.stringify(propDef)}`);
    const result = await this._sendLocalMiot(COMMAND_SET, [propDef]);
    const response = Array.isArray(result) ? result[0] : result;

    if (miotDevice._isResponseValid(response)) {
      this.logger.debug(`Successfully set strict property ${prop.getName()} to value ${adjustedValue}! Response: ${JSON.stringify(result)}`);
      prop.updateInternalValue(adjustedValue);
      miotDevice.emit(Events.MIOT_DEVICE_PROPERTY_VALUE_SET, prop);
      return result;
    }

    throw new Error(`Error while setting property ${prop.getName()} to value ${adjustedValue}. Response: ${JSON.stringify(result)}`);
  }

  async executeMethodStrict(methodName, paramValues = []) {
    if (!methodName) {
      throw new Error(`Missing method. Cannot execute robot cleaner method.`);
    }
    if (!this.isLocallyConnected()) {
      throw new Error(`Cannot execute method ${methodName} because the robot is not connected locally.`);
    }

    this.logger.deepDebug(`Executing strict robot cleaner method! Method: ${methodName} Params: ${JSON.stringify(paramValues)}`);
    const result = await this._sendLocalMiot(methodName, paramValues);
    const resultString = JSON.stringify(result);
    if (result && !resultString.includes('unknown_method')) {
      this.logger.debug(`Successfully executed strict method ${methodName} with params ${JSON.stringify(paramValues)}! Result: ${resultString}`);
      this.getMiotDevice().emit(Events.MIOT_DEVICE_METHOD_EXECUTED, methodName);
      return result;
    }

    throw new Error(`Error while executing method ${methodName} with params ${JSON.stringify(paramValues)}. Response: ${resultString}`);
  }

  async _tryDiscoverLegacyRooms() {
    if (!this.isLocallyConnected()) {
      return [];
    }

    try {
      const result = await this.executeMethodStrict('get_room_mapping', []);
      this.legacyRoomMappingSupported = true;
      return parseRoomsFromUnknownPayload(result);
    } catch (err) {
      this.logger.debug(`Robot cleaner room-mapping method is unavailable: ${err.message}`);
      return [];
    }
  }

  async _tryDiscoverMapActionRooms() {
    if (!this.isLocallyConnected()) {
      return [];
    }

    const rooms = [];
    const roomListAction = this.getAction('map:get-map-room-list');
    if (!roomListAction) {
      return rooms;
    }

    const mapIds = await this._discoverMapIds();
    const roomListParams = mapIds.length > 0 ? mapIds.map(mapId => [mapId]) : [[]];

    for (const params of roomListParams) {
      const mapId = params[0];
      try {
        const result = await this.fireActionStrict(roomListAction, params);
        const discoveredRooms = parseRoomsFromUnknownPayload(result && result.out ? result.out : result);
        rooms.push(...discoveredRooms.map(room => mapId == null ? room : { ...room, mapId: String(mapId) }));
      } catch (err) {
        this.logger.debug(`Map action room discovery failed for ${roomListAction.getName()}: ${err.message}`);
      }
    }

    return rooms;
  }

  async _discoverMapIds() {
    const mapIds = [];
    const currentMapId = this._getCurrentMapId();
    if (currentMapId) {
      mapIds.push(currentMapId);
    }

    const mapListAction = this.getAction('map:get-map-list');
    if (mapListAction) {
      try {
        const result = await this.fireActionStrict(mapListAction, []);
        mapIds.push(...parseMapIdsFromUnknownPayload(result && result.out ? result.out : result));
      } catch (err) {
        this.logger.debug(`Map list discovery failed for ${mapListAction.getName()}: ${err.message}`);
      }
    }

    return [...new Set(mapIds.filter(mapId => mapId != null && mapId !== '').map(String))];
  }

  _discoverRoomsFromCachedProperties() {
    return ROOM_DISCOVERY_PROPERTIES.flatMap((propName) => {
      const prop = this.getProperty(propName);
      return prop && !prop.isValueInitial ? parseRoomsFromUnknownPayload(prop.getValue()) : [];
    });
  }

  _getCurrentMapId() {
    const mapIdProps = [
      'map:cur-map-id',
      'viomi-vacuum:cur-map-id',
      'map:map-id',
      'sweep:clean-current-map'
    ];

    for (const propName of mapIdProps) {
      const prop = this.getProperty(propName);
      const value = prop ? prop.getValue() : null;
      if (value != null && value !== '' && value !== 0) {
        return value;
      }
    }

    return null;
  }

  _dedupeRooms(rooms) {
    return Array.from(new Map(rooms.filter(room => room && room.id != null).map(room => [String(room.id), room])).values());
  }

  async _readLegacyMiioProperties(params = []) {
    const status = await this._readLegacyMiioStatus();
    return params.map(param => {
      const property = this.getPropertyById(`${param.siid}.${param.piid}`);
      const value = this._getLegacyMiioPropertyValue(status, property?.getName());
      return value === undefined ? { code: -1 } : { code: 0, value };
    });
  }

  async _readLegacyMiioDeviceInfo() {
    await this._readLegacyMiioStatus();
    return { model: this.getModel(), fw_ver: 'unknown' };
  }

  async _readLegacyMiioStatus() {
    const result = await this.getMiotDevice().miioProtocol.send(this.getMiotDevice().ip, 'get_status', []);
    this.legacyMiioSupported = true;
    return Array.isArray(result) ? result[0] || {} : result || {};
  }

  _getLegacyMiioPropertyValue(status, propertyName) {
    if (propertyName === 'vacuum:status') {
      return this._mapLegacyMiioState(status.state);
    }
    if (propertyName === 'vacuum:mode' || propertyName === 'vacuum:speed-level') {
      return status.fan_power;
    }
    if (propertyName === 'battery:battery-level') {
      return status.battery;
    }
    if (propertyName === 'battery:charging-state') {
      return this._firstValue(this._isLegacyMiioCharging(status.state)
        ? this.chargingStateChargingValue()
        : this.chargingStateNotChargingValue());
    }
    return undefined;
  }

  _mapLegacyMiioState(state) {
    if ([5, 11, 17, 18].includes(state)) return this._firstValue(this.statusSweepingValue());
    if (state === 10) return this._firstValue(this.statusPausedValue());
    if (state === 6) return this._firstValue(this.statusGoChargingValue());
    if (state === 8) return this._firstValue(this.statusChargingValue());
    if (state === 12) return this._firstValue(this.statusErrorValue());
    return this._firstValue(this.statusIdleValue());
  }

  _isLegacyMiioCharging(state) {
    return state === 8;
  }

  _firstValue(value) {
    return Array.isArray(value) ? value[0] : value;
  }

  async _sendLocalMiot(methodName, params = []) {
    const miotDevice = this.getMiotDevice();
    if (!miotDevice.isConnectedToLocalDevice()) {
      throw new Error(`Cannot execute local MIOT command ${methodName}. Robot is not connected locally.`);
    }
    return miotDevice.miioProtocol.send(miotDevice.ip, methodName, params);
  }


}

module.exports = RobotCleanerDevice;
