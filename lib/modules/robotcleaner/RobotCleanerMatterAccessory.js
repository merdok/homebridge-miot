const fs = require('fs').promises;
const {
  MATTER_RVC_RUN_MODES,
  MATTER_RVC_CLEAN_MODES,
  MATTER_RVC_OPERATIONAL_STATES,
  MATTER_RVC_RUN_MODE_TAGS,
  MATTER_RVC_CLEAN_MODE_TAGS,
  batteryPercentToMatter,
  batteryChargeLevel,
  matterOperationalStateFromFlags,
  normalizeMatterRooms,
  matterMapsFromRooms,
  matterAreasFromRooms
} = require('./RobotCleanerMatterUtils.js');

const SERVICE_AREA_CLUSTER_NAME = 'serviceArea';
const DEFAULT_ROOM_DISCOVERY_INTERVAL_MS = 6 * 60 * 60 * 1000;

const matterMode = (label, mode, modeTags) => ({ label, mode, modeTags: modeTags.map(value => ({ value })) });

class RobotCleanerMatterAccessory {
  constructor(name, device, uuid, config, api, logger, cachedDeviceInfo = {}, restoredMatterAccessory = null, options = {}) {
    this.name = name;
    this.device = device;
    this.uuid = uuid;
    this.config = config || {};
    this.api = api;
    this.logger = logger;
    this.cachedDeviceInfo = cachedDeviceInfo || {};
    this.restoredMatterAccessory = restoredMatterAccessory;
    this.roomCacheFile = options.roomCacheFile;
    this.cachedRooms = [];
    this.normalizedRooms = [];
    this.lastRoomDiscoveryAt = 0;
    this.roomDiscoveryInFlight = null;
    this.currentCleanMode = MATTER_RVC_CLEAN_MODES.VACUUM;
    this.selectedAreaIds = [];
    this.areaIdToRoom = new Map();
    this.accessory = null;
    this.reachable = false;
  }

  async init() {
    this.cachedRooms = await this._loadCachedRooms();
    this.normalizedRooms = this._getNormalizedRooms();
    this.areaIdToRoom = this._createAreaIdRoomMap(this.normalizedRooms);
    this.selectedAreaIds = this._getRestoredSelectedAreaIds();
    this.accessory = this._createOrUpdateAccessory();
    this._attachHandlers();

    return this;
  }

  getMatterAccessory() {
    return this.accessory;
  }

  updateAccessoryStatus() {
    this._syncMatterState().catch((err) => {
      this.logger.debug(`Matter robot state sync failed: ${err.message}`);
    });

    this._refreshDiscoveredRoomsIfNeeded().catch((err) => {
      this.logger.debug(`Matter robot room discovery failed: ${err.message}`);
    });
  }

  async handleRunModeChange(newMode) {
    this._assertDeviceConnected();
    const selectedRoomIds = this._getSelectedVendorRoomIds();
    this.logger.info(`Matter run mode change requested: ${newMode}${selectedRoomIds.length > 0 ? ` for rooms ${selectedRoomIds.join(',')}` : ''}`);

    if (newMode === MATTER_RVC_RUN_MODES.CLEANING) {
      const cleaningOptions = this._getCleaningOptions();
      if (selectedRoomIds.length > 0) {
        await this.device.startRoomCleaning(selectedRoomIds, cleaningOptions);
      } else {
        await this.device.startCleaning(cleaningOptions);
      }
      await this._updateClusterState(this._clusterNames().RvcOperationalState, {
        operationalState: MATTER_RVC_OPERATIONAL_STATES.RUNNING
      });
    } else if (newMode === MATTER_RVC_RUN_MODES.IDLE) {
      await this.device.goHome();
      await this._updateClusterState(this._clusterNames().RvcOperationalState, {
        operationalState: MATTER_RVC_OPERATIONAL_STATES.SEEKING_CHARGER
      });
    } else {
      throw new Error(`Unsupported Matter run mode: ${newMode}`);
    }
  }

  async handleCleanModeChange(newMode) {
    this.logger.info(`Matter clean mode change requested: ${newMode}`);
    const supportedMode = this._getSupportedCleanModes().find(mode => mode.mode === newMode);
    if (!supportedMode) {
      throw new Error(`Matter clean mode ${newMode} is not supported by this robot.`);
    }
    this.currentCleanMode = newMode;
  }

  async handlePause() {
    this.logger.info('Matter pause requested.');
    return this._runOperationalCommand('pauseCleaning', MATTER_RVC_OPERATIONAL_STATES.PAUSED);
  }

  async handleResume() {
    this.logger.info('Matter resume requested.');
    return this._runOperationalCommand('resumeCleaning', MATTER_RVC_OPERATIONAL_STATES.RUNNING, this._getCleaningOptions());
  }

  async handleGoHome() {
    this.logger.info('Matter go home requested.');
    return this._runOperationalCommand('goHome', MATTER_RVC_OPERATIONAL_STATES.SEEKING_CHARGER);
  }

  async handleIdentify() {
    this._assertDeviceConnected();
    return this.device.identify();
  }

  async _runOperationalCommand(command, operationalState, ...args) {
    this._assertDeviceConnected();
    await this.device[command](...args);
    await this._updateClusterState(this._clusterNames().RvcOperationalState, {
      operationalState
    });
  }

  async handleSelectAreas(request = {}) {
    const newAreas = Array.isArray(request.newAreas) ? request.newAreas : [];
    const supportedAreaIds = new Set(this.normalizedRooms.map(room => room.areaId));
    const invalidArea = newAreas.find(areaId => !supportedAreaIds.has(areaId));
    if (invalidArea != null) {
      throw new Error(`Matter area ${invalidArea} is not known for this robot.`);
    }

    this.selectedAreaIds = [...new Set(newAreas)];
    this._updateContext();
    await this._updateClusterState(this._clusterNames().ServiceArea, {
      selectedAreas: this.selectedAreaIds
    });
  }

  async handleSkipArea() {
    throw new Error('Skipping individual areas is not supported by this robot.');
  }

  _createOrUpdateAccessory() {
    const accessory = this.restoredMatterAccessory || {
      UUID: this.uuid,
      displayName: this.name
    };
    const clusters = this._buildClusters(accessory.clusters || {});

    accessory.UUID = this.uuid;
    accessory.displayName = this.name;
    accessory.deviceType = this.api.matter.deviceTypes.RoboticVacuumCleaner;
    accessory.serialNumber = this._getSerialNumber();
    accessory.manufacturer = this._getManufacturerName();
    accessory.model = this.device.getModel() || this.cachedDeviceInfo.model || 'Unknown';
    accessory.firmwareRevision = this.cachedDeviceInfo.firmwareRev || 'Unknown';
    accessory.context = {
      ...(accessory.context || {}),
      plugin: 'homebridge-miot',
      deviceType: this.device.getType(),
      model: accessory.model,
      selectedAreaIds: this.selectedAreaIds,
      rooms: this.normalizedRooms
    };
    accessory.clusters = clusters;
    accessory.getState = async (cluster, attribute) => this.handleStateRead(cluster, attribute);

    return accessory;
  }

  async handleStateRead(cluster, attribute) {
    this.reachable = await this.device.isReachable();
    if (!this.reachable) {
      throw new Error('Robot cleaner is not reachable locally or through MiCloud.');
    }

    const localClusterName = this._localClusterName(cluster);
    return this.accessory?.clusters?.[localClusterName]?.[attribute];
  }

  _attachHandlers() {
    this.accessory.handlers = {
      rvcRunMode: {
        changeToMode: async request => this.handleRunModeChange(request.newMode)
      },
      rvcCleanMode: {
        changeToMode: async request => this.handleCleanModeChange(request.newMode)
      },
      rvcOperationalState: {
        pause: async () => this.handlePause(),
        resume: async () => this.handleResume(),
        goHome: async () => this.handleGoHome()
      }
    };

    if (this._shouldExposeServiceArea()) {
      this.accessory.handlers.serviceArea = {
        selectAreas: async request => this.handleSelectAreas(request),
        skipArea: async request => this.handleSkipArea(request)
      };
    }

    if (this.device.supportsIdentify()) {
      this.accessory.handlers.identify = {
        identify: async () => this.handleIdentify()
      };
    }
  }

  _buildClusters(existingClusters = {}) {
    const powerSourceCluster = this._buildPowerSourceCluster(existingClusters.powerSource);
    const clusters = {
      rvcRunMode: this._mergeCluster(existingClusters.rvcRunMode, {
        supportedModes: [
          matterMode('Idle', MATTER_RVC_RUN_MODES.IDLE, [MATTER_RVC_RUN_MODE_TAGS.IDLE]),
          matterMode('Cleaning', MATTER_RVC_RUN_MODES.CLEANING, [MATTER_RVC_RUN_MODE_TAGS.CLEANING])
        ],
        currentMode: this._getRunMode()
      }),
      rvcCleanMode: this._mergeCluster(existingClusters.rvcCleanMode, {
        supportedModes: this._getSupportedCleanModes(),
        currentMode: this.currentCleanMode
      }),
      rvcOperationalState: this._mergeCluster(existingClusters.rvcOperationalState, {
        operationalStateList: this._getOperationalStateList(),
        operationalState: this._getOperationalState()
      }),
      powerSource: powerSourceCluster
    };

    if (this._shouldExposeServiceArea()) {
      clusters.serviceArea = this._mergeCluster(existingClusters.serviceArea, this._serviceAreaState({
        currentArea: null,
        progress: []
      }));
    }

    return clusters;
  }

  _buildPowerSourceCluster(existingCluster = {}) {
    const batteryState = this._getBatteryState();
    const cluster = {
      ...existingCluster,
      status: 0,
      order: 0,
      description: 'Battery',
      batReplaceability: 1
    };

    const cachedBatteryPercent = Number(cluster.batPercentRemaining);
    if (this.device.hasKnownBatteryLevel() || !Number.isFinite(cachedBatteryPercent) || cachedBatteryPercent <= 0) {
      cluster.batPercentRemaining = batteryState.batPercentRemaining;
      cluster.batChargeLevel = batteryState.batChargeLevel;
    }

    return cluster;
  }

  _mergeCluster(existingCluster = {}, clusterDefaults = {}) {
    return {
      ...existingCluster,
      ...clusterDefaults
    };
  }

  _getSupportedCleanModes() {
    const modes = [
      matterMode('Vacuum', MATTER_RVC_CLEAN_MODES.VACUUM, [MATTER_RVC_CLEAN_MODE_TAGS.VACUUM])
    ];

    if (this.device.supportsMopCleaning()) {
      modes.push(matterMode('Mop', MATTER_RVC_CLEAN_MODES.MOP, [MATTER_RVC_CLEAN_MODE_TAGS.MOP]));
    }

    if (this.device.supportsCombinedCleaning()) {
      modes.push(matterMode('Vacuum and Mop', MATTER_RVC_CLEAN_MODES.VACUUM_MOP, [
        MATTER_RVC_CLEAN_MODE_TAGS.VACUUM,
        MATTER_RVC_CLEAN_MODE_TAGS.MOP
      ]));
    }

    return modes;
  }

  _getOperationalStateList() {
    return Object.values(MATTER_RVC_OPERATIONAL_STATES).map(operationalStateId => ({ operationalStateId }));
  }

  _getCleaningOptions(cleanMode = this.currentCleanMode) {
    return {
      vacuum: cleanMode !== MATTER_RVC_CLEAN_MODES.MOP,
      mop: cleanMode !== MATTER_RVC_CLEAN_MODES.VACUUM
    };
  }

  _getRunMode() {
    return this.device.isVacuumWorking() ? MATTER_RVC_RUN_MODES.CLEANING : MATTER_RVC_RUN_MODES.IDLE;
  }

  _getOperationalState() {
    return matterOperationalStateFromFlags(this.device.getOperationalStateFlags());
  }

  _getBatteryState() {
    const batteryPercent = this.device.hasKnownBatteryLevel() ? this.device.getBatteryLevel() : 100;
    return {
      batPercentRemaining: batteryPercentToMatter(batteryPercent),
      batChargeLevel: batteryChargeLevel(batteryPercent)
    };
  }

  async _syncMatterState() {
    if (!this.accessory || !this.api.matter) {
      return;
    }

    this.reachable = await this.device.isReachable();

    await this._updateClusterState(this._clusterNames().RvcRunMode, {
      currentMode: this._getRunMode()
    });
    await this._updateClusterState(this._clusterNames().RvcOperationalState, {
      operationalState: this.reachable ? this._getOperationalState() : MATTER_RVC_OPERATIONAL_STATES.ERROR
    });
    await this._updateClusterState(this._clusterNames().PowerSource, this._getBatteryState());

    if (this._shouldExposeServiceArea()) {
      this.selectedAreaIds = this.selectedAreaIds.filter(areaId => this.areaIdToRoom.has(areaId));
      this._updateContext();
      await this._updateClusterState(this._clusterNames().ServiceArea, this._serviceAreaState());
    }
  }

  async _updateClusterState(clusterName, attributes = {}) {
    if (!clusterName || !this.api.matter || !this.accessory) {
      return;
    }

    const localClusterName = this._localClusterName(clusterName);
    const currentClusterState = this.accessory.clusters[localClusterName] || {};
    const changedAttributes = {};

    Object.keys(attributes).forEach((key) => {
      if (JSON.stringify(currentClusterState[key]) !== JSON.stringify(attributes[key])) {
        changedAttributes[key] = attributes[key];
      }
    });

    if (Object.keys(changedAttributes).length === 0) {
      return;
    }

    this.accessory.clusters[localClusterName] = {
      ...currentClusterState,
      ...changedAttributes
    };

    await this.api.matter.updateAccessoryState(this.uuid, clusterName, changedAttributes);
  }

  async _refreshDiscoveredRoomsIfNeeded() {
    if (!this._shouldDiscoverRooms() || !this.device.isLocallyConnected()) {
      return;
    }

    const intervalMs = this._getRoomDiscoveryIntervalMs();
    if (Date.now() - this.lastRoomDiscoveryAt < intervalMs) {
      return;
    }
    if (this.roomDiscoveryInFlight) {
      return this.roomDiscoveryInFlight;
    }

    this.roomDiscoveryInFlight = this._refreshDiscoveredRooms().finally(() => {
      this.roomDiscoveryInFlight = null;
    });

    return this.roomDiscoveryInFlight;
  }

  async _refreshDiscoveredRooms() {
    this.lastRoomDiscoveryAt = Date.now();
    const discoveredRooms = await this.device.discoverRooms();
    if (!discoveredRooms || discoveredRooms.length === 0) {
      return;
    }

    this.cachedRooms = discoveredRooms;
    await this._saveCachedRooms(discoveredRooms);
    this.normalizedRooms = this._getNormalizedRooms();
    this.areaIdToRoom = this._createAreaIdRoomMap(this.normalizedRooms);
    this.selectedAreaIds = this.selectedAreaIds.filter(areaId => this.areaIdToRoom.has(areaId));
    this._updateContext();

    if (this.accessory.clusters && this._shouldExposeServiceArea()) {
      this.accessory.clusters.serviceArea = {
        ...(this.accessory.clusters.serviceArea || {}),
        ...this._serviceAreaState()
      };
    }
  }

  _serviceAreaState(extraState = {}) {
    const supportedMaps = matterMapsFromRooms(this.normalizedRooms);
    const serviceAreaState = {
      supportedMaps,
      supportedAreas: matterAreasFromRooms(this.normalizedRooms),
      selectedAreas: this.selectedAreaIds
    };

    return {
      ...serviceAreaState,
      ...extraState
    };
  }

  _shouldExposeServiceArea() {
    return this.device.supportsRoomCleaning() || this._getConfiguredRooms().length > 0 || this.cachedRooms.length > 0 || this.normalizedRooms.length > 0;
  }

  _shouldDiscoverRooms() {
    return this.config.matterRoomDiscovery !== 'disabled' && this.device.supportsRoomDiscovery();
  }

  _getNormalizedRooms() {
    return normalizeMatterRooms(this.cachedRooms, this._getConfiguredRooms());
  }

  _getConfiguredRooms() {
    return Array.isArray(this.config.matterRooms) ? this.config.matterRooms : [];
  }

  _getSelectedVendorRoomIds() {
    return this.selectedAreaIds
      .map(areaId => this.areaIdToRoom.get(areaId))
      .filter(room => room)
      .map(room => room.vendorId);
  }

  _getRestoredSelectedAreaIds() {
    const restoredSelectedAreas = this.restoredMatterAccessory?.clusters?.serviceArea?.selectedAreas;
    const selectedAreaIds = Array.isArray(restoredSelectedAreas) ? restoredSelectedAreas : this.config.selectedAreaIds;
    return Array.isArray(selectedAreaIds) ? [...new Set(selectedAreaIds.filter(areaId => this.areaIdToRoom.has(areaId)))] : [];
  }

  _createAreaIdRoomMap(rooms) {
    return new Map(rooms.map(room => [room.areaId, room]));
  }

  _updateContext() {
    if (this.accessory) {
      this.accessory.context = {
        ...(this.accessory.context || {}),
        selectedAreaIds: this.selectedAreaIds,
        rooms: this.normalizedRooms
      };
    }
  }

  _assertDeviceConnected() {
    if (this.config.deviceEnabled === false) {
      throw new Error('Robot cleaner is disabled in the Homebridge config.');
    }
    if (!this.device.isLocallyConnected()) {
      throw new Error('Robot cleaner is not connected locally.');
    }
  }

  _clusterNames() {
    return {
      RvcRunMode: 'rvcRunMode',
      RvcCleanMode: 'rvcCleanMode',
      RvcOperationalState: 'rvcOperationalState',
      PowerSource: 'powerSource',
      ServiceArea: SERVICE_AREA_CLUSTER_NAME,
      ...(this.api.matter.clusterNames || {})
    };
  }

  _localClusterName(clusterName) {
    const names = this._clusterNames();
    if (clusterName === names.RvcRunMode) return 'rvcRunMode';
    if (clusterName === names.RvcCleanMode) return 'rvcCleanMode';
    if (clusterName === names.RvcOperationalState) return 'rvcOperationalState';
    if (clusterName === names.PowerSource) return 'powerSource';
    if (clusterName === names.ServiceArea) return SERVICE_AREA_CLUSTER_NAME;
    return clusterName;
  }

  _getRoomDiscoveryIntervalMs() {
    const intervalHours = Number(this.config.matterRoomDiscoveryInterval);
    if (Number.isFinite(intervalHours) && intervalHours >= 1) {
      return intervalHours * 60 * 60 * 1000;
    }
    return DEFAULT_ROOM_DISCOVERY_INTERVAL_MS;
  }

  async _loadCachedRooms() {
    if (!this.roomCacheFile) {
      return [];
    }

    try {
      const cacheContent = await fs.readFile(this.roomCacheFile, 'utf8');
      const parsedCache = JSON.parse(cacheContent);
      return Array.isArray(parsedCache.rooms) ? parsedCache.rooms : [];
    } catch (err) {
      return [];
    }
  }

  async _saveCachedRooms(rooms) {
    if (!this.roomCacheFile) {
      return;
    }

    const cacheContent = JSON.stringify({
      updatedAt: new Date().toISOString(),
      rooms
    }, null, 2);
    await fs.writeFile(this.roomCacheFile, cacheContent, 'utf8');
  }

  _getManufacturerName() {
    const model = this.device.getModel() || this.cachedDeviceInfo.model || '';
    if (model.includes('yeelink.')) {
      return 'Yeelight Technology';
    }
    if (model.includes('.')) {
      const manufacturer = model.split('.')[0];
      return manufacturer.charAt(0).toUpperCase() + manufacturer.substring(1);
    }
    return 'Xiaomi';
  }

  _getSerialNumber() {
    return this.device.getMiotDevice().getDeviceId() || this.cachedDeviceInfo.deviceId || this.uuid;
  }
}

module.exports = RobotCleanerMatterAccessory;
