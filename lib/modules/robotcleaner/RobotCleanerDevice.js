const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');
const Events = require('../../constants/Events.js');
const {
  MATTER_RVC_RUN_MODES,
  MATTER_RVC_CLEAN_MODES,
  batteryPercentToMatter,
  batteryChargeLevel,
  matterOperationalStateFromFlags,
  selectMatterCleanModeAction,
  parseRoomsFromUnknownPayload
} = require('./RobotCleanerMatterUtils.js');

const COMMAND_ACTION = 'action';


class RobotCleanerDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
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

  supportsMatterMopMode() {
    return !!this.startMopAction();
  }

  supportsMatterSweepMopMode() {
    return !!this.startSweepMopAction();
  }

  supportsMatterPause() {
    return !!this.pauseSweepAction();
  }

  supportsMatterResume() {
    return !!this.resumeSweepAction();
  }

  supportsMatterRoomCleaning() {
    return !!(this.startRoomSweepAction() || this.viomiRoomCleanAction() || this.ijaiRoomCleanAction() || this.dreameRoomCleanAction() || this._isRoborockModel());
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

  async setMatterRunMode(mode, selectedRoomIds = [], cleanMode = MATTER_RVC_CLEAN_MODES.VACUUM) {
    if (mode === MATTER_RVC_RUN_MODES.CLEANING) {
      if (selectedRoomIds && selectedRoomIds.length > 0) {
        return this.startMatterRoomCleaning(selectedRoomIds, cleanMode);
      }
      return this.startMatterCleaning(cleanMode);
    }
    if (mode === MATTER_RVC_RUN_MODES.IDLE) {
      return this.sendMatterGoHome();
    }
    throw new Error(`Unsupported Matter run mode: ${mode}`);
  }

  async startMatterCleaning(cleanMode = MATTER_RVC_CLEAN_MODES.VACUUM) {
    const action = selectMatterCleanModeAction(cleanMode, {
      startOnlySweep: this.startOnlySweepAction(),
      startSweep: this.startSweepAction(),
      startMop: this.startMopAction(),
      startSweepMop: this.startSweepMopAction()
    });

    if (!action) {
      throw new Error(`Matter clean mode ${cleanMode} is not supported by this robot.`);
    }

    return this.fireActionStrict(action);
  }

  async startMatterRoomCleaning(roomIds = [], cleanMode = MATTER_RVC_CLEAN_MODES.VACUUM) {
    const normalizedRoomIds = roomIds.map(roomId => String(roomId)).filter(roomId => roomId.length > 0);
    if (normalizedRoomIds.length === 0) {
      return this.startMatterCleaning(cleanMode);
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
    if (this._isRoborockModel()) {
      return this.executeMethodStrict('app_segment_clean', [{
        clean_mop: cleanMode === MATTER_RVC_CLEAN_MODES.MOP ? 1 : 0,
        segments: normalizedRoomIds.map(roomId => Number(roomId) || roomId),
        repeat: 1,
        clean_order_mode: 0
      }]);
    }

    throw new Error(`Room cleaning is not supported by this robot.`);
  }

  async pauseMatterCleaning() {
    if (this.pauseSweepAction()) {
      return this.fireActionStrict(this.pauseSweepAction());
    }
    throw new Error(`Pause is not supported by this robot.`);
  }

  async resumeMatterCleaning() {
    if (this.resumeSweepAction()) {
      return this.fireActionStrict(this.resumeSweepAction());
    }
    throw new Error(`Resume is not supported by this robot.`);
  }

  async sendMatterGoHome() {
    if (this.startChargeAction()) {
      return this.fireActionStrict(this.startChargeAction());
    }
    throw new Error(`Go home is not supported by this robot.`);
  }

  isVacuumWorking() {
    return this.isStatusSweeping() || this.isStatusSweepingAndMopping() || this.isStatusMopping();
  }

  getMatterRunMode() {
    return this.isVacuumWorking() ? MATTER_RVC_RUN_MODES.CLEANING : MATTER_RVC_RUN_MODES.IDLE;
  }

  getMatterOperationalState() {
    return matterOperationalStateFromFlags({
      hasFault: this.supportsFaultReporting() && this.getFault() > 0,
      isError: this.isStatusError(),
      isWorking: this.isVacuumWorking(),
      isPaused: this.isStatusPause(),
      isGoCharging: this.isStatusGoCharging(),
      isCharging: this.isStatusCharging(),
      isDocked: this.isStatusChargingCompleted(),
      isEmptyingDustBin: this.isStatusEmptying(),
      isCleaningMop: this.isStatusWash() || this.isStatusWashing() || this.isStatusDrying(),
      isUpdatingMaps: this.isStatusUpdating() || this.isStatusUpgrading()
    });
  }

  getMatterBatteryState() {
    const batteryPercent = this.supportsBatteryLevelReporting() ? this.getBatteryLevel() : 100;
    return {
      batPercentRemaining: batteryPercentToMatter(batteryPercent),
      batChargeLevel: batteryChargeLevel(batteryPercent)
    };
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

  async discoverMatterRooms() {
    const roomResults = [];

    roomResults.push(...await this._tryDiscoverRoborockRooms());
    roomResults.push(...await this._tryDiscoverMapActionRooms());
    roomResults.push(...this._discoverRoomsFromCachedProperties());

    return this._dedupeMatterRooms(roomResults);
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
    const result = await this._sendLocalMiotAction(actionDef);
    action.setLastResult(result);

    if (miotDevice._isResponseValid(result)) {
      this.logger.debug(`Successfully executed strict action ${action.getName()} with params ${JSON.stringify(paramValues)}! Result: ${JSON.stringify(result)}`);
      miotDevice.emit(Events.MIOT_DEVICE_ACTION_EXECUTED, action);
      return result;
    }

    throw new Error(`Error while executing action ${action.getName()} with params ${JSON.stringify(paramValues)}. Response: ${JSON.stringify(result)}`);
  }

  async executeMethodStrict(methodName, paramValues = []) {
    if (!methodName) {
      throw new Error(`Missing method. Cannot execute robot cleaner method.`);
    }
    if (!this.isLocallyConnected()) {
      throw new Error(`Cannot execute method ${methodName} because the robot is not connected locally.`);
    }

    this.logger.deepDebug(`Executing strict robot cleaner method! Method: ${methodName} Params: ${JSON.stringify(paramValues)}`);
    const result = await this._sendLocalMiotMethod(methodName, paramValues);
    const resultString = JSON.stringify(result);
    if (result && !resultString.includes('unknown_method')) {
      this.logger.debug(`Successfully executed strict method ${methodName} with params ${JSON.stringify(paramValues)}! Result: ${resultString}`);
      this.getMiotDevice().emit(Events.MIOT_DEVICE_METHOD_EXECUTED, methodName);
      return result;
    }

    throw new Error(`Error while executing method ${methodName} with params ${JSON.stringify(paramValues)}. Response: ${resultString}`);
  }

  async _tryDiscoverRoborockRooms() {
    if (!this._isRoborockModel() || !this.isLocallyConnected()) {
      return [];
    }

    try {
      const result = await this.executeMethodStrict('get_room_mapping', []);
      return parseRoomsFromUnknownPayload(result);
    } catch (err) {
      this.logger.debug(`Roborock room discovery failed: ${err.message}`);
      return [];
    }
  }

  async _tryDiscoverMapActionRooms() {
    if (!this.isLocallyConnected()) {
      return [];
    }

    const rooms = [];
    const currentMapId = this._getCurrentMapId();
    const actionAttempts = [
      { action: this.getAction('map:get-map-room-list'), params: currentMapId ? [currentMapId] : [] },
      { action: this.getAction('map:get-map-list'), params: [] }
    ];

    for (const attempt of actionAttempts) {
      if (!attempt.action) {
        continue;
      }
      try {
        const result = await this.fireActionStrict(attempt.action, attempt.params);
        rooms.push(...parseRoomsFromUnknownPayload(result && result.out ? result.out : result));
      } catch (err) {
        this.logger.debug(`Map action room discovery failed for ${attempt.action.getName()}: ${err.message}`);
      }
    }

    return rooms;
  }

  _discoverRoomsFromCachedProperties() {
    const propNames = [
      'map:room-id-name-list',
      'map:mijia-room-list',
      'map:map-list',
      'order:room-data',
      'order:orderdata',
      'vacuum:room-ids'
    ];
    const rooms = [];

    propNames.forEach((propName) => {
      const prop = this.getProperty(propName);
      if (prop) {
        rooms.push(...parseRoomsFromUnknownPayload(prop.getValue()));
      }
    });

    return rooms;
  }

  _dedupeMatterRooms(rooms = []) {
    const roomMap = new Map();
    rooms.forEach((room) => {
      if (room && room.id != null) {
        roomMap.set(String(room.id), room);
      }
    });
    return Array.from(roomMap.values());
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

  _isRoborockModel() {
    const model = this.getModel() || '';
    return model.includes('roborock.') || model.includes('rockrobo.');
  }

  async _sendLocalMiotAction(actionDef) {
    return this._sendLocalMiot(COMMAND_ACTION, actionDef);
  }

  async _sendLocalMiotMethod(methodName, paramValues = []) {
    return this._sendLocalMiot(methodName, paramValues);
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
