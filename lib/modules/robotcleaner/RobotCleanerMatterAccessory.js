const fs = require('fs').promises;
const {
  MATTER_RVC_RUN_MODES,
  MATTER_RVC_CLEAN_MODES,
  MATTER_RVC_OPERATIONAL_STATES,
  MATTER_RVC_RUN_MODE_TAGS,
  MATTER_RVC_CLEAN_MODE_TAGS,
  normalizeMatterRooms,
  matterAreasFromRooms
} = require('./RobotCleanerMatterUtils.js');

const SERVICE_AREA_CLUSTER_NAME = 'serviceArea';
const DEFAULT_ROOM_DISCOVERY_INTERVAL_MS = 6 * 60 * 60 * 1000;

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

    await this.device.setMatterRunMode(newMode, selectedRoomIds, this.currentCleanMode);

    if (newMode === MATTER_RVC_RUN_MODES.CLEANING) {
      await this._updateClusterState(this._clusterNames().RvcOperationalState, {
        operationalState: MATTER_RVC_OPERATIONAL_STATES.RUNNING
      });
    } else if (newMode === MATTER_RVC_RUN_MODES.IDLE) {
      await this._updateClusterState(this._clusterNames().RvcOperationalState, {
        operationalState: MATTER_RVC_OPERATIONAL_STATES.SEEKING_CHARGER
      });
    }
  }

  async handleCleanModeChange(newMode) {
    const supportedMode = this._getSupportedCleanModes().find(mode => mode.mode === newMode);
    if (!supportedMode) {
      throw new Error(`Matter clean mode ${newMode} is not supported by this robot.`);
    }
    this.currentCleanMode = newMode;
  }

  async handlePause() {
    this._assertDeviceConnected();
    await this.device.pauseMatterCleaning();
    await this._updateClusterState(this._clusterNames().RvcOperationalState, {
      operationalState: MATTER_RVC_OPERATIONAL_STATES.PAUSED
    });
  }

  async handleResume() {
    this._assertDeviceConnected();
    await this.device.resumeMatterCleaning();
    await this._updateClusterState(this._clusterNames().RvcOperationalState, {
      operationalState: MATTER_RVC_OPERATIONAL_STATES.RUNNING
    });
  }

  async handleGoHome() {
    this._assertDeviceConnected();
    await this.device.sendMatterGoHome();
    await this._updateClusterState(this._clusterNames().RvcOperationalState, {
      operationalState: MATTER_RVC_OPERATIONAL_STATES.SEEKING_CHARGER
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
    await this._updateClusterState(SERVICE_AREA_CLUSTER_NAME, {
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

    return accessory;
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
  }

  _buildClusters(existingClusters = {}) {
    const clusters = {
      rvcRunMode: this._mergeCluster(existingClusters.rvcRunMode, {
        supportedModes: [
          { label: 'Idle', mode: MATTER_RVC_RUN_MODES.IDLE, modeTags: [{ value: MATTER_RVC_RUN_MODE_TAGS.IDLE }] },
          { label: 'Cleaning', mode: MATTER_RVC_RUN_MODES.CLEANING, modeTags: [{ value: MATTER_RVC_RUN_MODE_TAGS.CLEANING }] }
        ],
        currentMode: this.device.getMatterRunMode()
      }),
      rvcCleanMode: this._mergeCluster(existingClusters.rvcCleanMode, {
        supportedModes: this._getSupportedCleanModes(),
        currentMode: this.currentCleanMode
      }),
      rvcOperationalState: this._mergeCluster(existingClusters.rvcOperationalState, {
        operationalStateList: this._getOperationalStateList(),
        operationalState: this.device.getMatterOperationalState()
      }),
      powerSource: this._mergeCluster(existingClusters.powerSource, {
        status: 0,
        order: 0,
        description: 'Battery',
        batPercentRemaining: this.device.getMatterBatteryState().batPercentRemaining,
        batChargeLevel: this.device.getMatterBatteryState().batChargeLevel,
        batReplaceability: 1
      })
    };

    if (this._shouldExposeServiceArea()) {
      clusters.serviceArea = this._mergeCluster(existingClusters.serviceArea, {
        supportedMaps: [],
        supportedAreas: matterAreasFromRooms(this.normalizedRooms),
        selectedAreas: this.selectedAreaIds,
        currentArea: null,
        progress: []
      });
    }

    return clusters;
  }

  _mergeCluster(existingCluster = {}, clusterDefaults = {}) {
    return {
      ...clusterDefaults,
      ...existingCluster,
      supportedModes: clusterDefaults.supportedModes || existingCluster.supportedModes,
      operationalStateList: clusterDefaults.operationalStateList || existingCluster.operationalStateList,
      supportedAreas: clusterDefaults.supportedAreas || existingCluster.supportedAreas,
      supportedMaps: clusterDefaults.supportedMaps || existingCluster.supportedMaps,
      selectedAreas: clusterDefaults.selectedAreas || existingCluster.selectedAreas
    };
  }

  _getSupportedCleanModes() {
    const modes = [
      { label: 'Vacuum', mode: MATTER_RVC_CLEAN_MODES.VACUUM, modeTags: [{ value: MATTER_RVC_CLEAN_MODE_TAGS.VACUUM }] }
    ];

    if (this.device.supportsMatterMopMode()) {
      modes.push({ label: 'Mop', mode: MATTER_RVC_CLEAN_MODES.MOP, modeTags: [{ value: MATTER_RVC_CLEAN_MODE_TAGS.MOP }] });
    }

    if (this.device.supportsMatterSweepMopMode()) {
      modes.push({
        label: 'Vacuum and Mop',
        mode: MATTER_RVC_CLEAN_MODES.VACUUM_MOP,
        modeTags: [
          { value: MATTER_RVC_CLEAN_MODE_TAGS.VACUUM },
          { value: MATTER_RVC_CLEAN_MODE_TAGS.MOP }
        ]
      });
    }

    return modes;
  }

  _getOperationalStateList() {
    return [
      MATTER_RVC_OPERATIONAL_STATES.STOPPED,
      MATTER_RVC_OPERATIONAL_STATES.RUNNING,
      MATTER_RVC_OPERATIONAL_STATES.PAUSED,
      MATTER_RVC_OPERATIONAL_STATES.ERROR,
      MATTER_RVC_OPERATIONAL_STATES.SEEKING_CHARGER,
      MATTER_RVC_OPERATIONAL_STATES.CHARGING,
      MATTER_RVC_OPERATIONAL_STATES.DOCKED,
      MATTER_RVC_OPERATIONAL_STATES.EMPTYING_DUST_BIN,
      MATTER_RVC_OPERATIONAL_STATES.CLEANING_MOP,
      MATTER_RVC_OPERATIONAL_STATES.FILLING_WATER_TANK,
      MATTER_RVC_OPERATIONAL_STATES.UPDATING_MAPS
    ].map(operationalStateId => ({ operationalStateId }));
  }

  async _syncMatterState() {
    if (!this.accessory || !this.api.matter) {
      return;
    }

    await this._updateClusterState(this._clusterNames().RvcRunMode, {
      currentMode: this.device.getMatterRunMode()
    });
    await this._updateClusterState(this._clusterNames().RvcOperationalState, {
      operationalState: this.device.getMatterOperationalState()
    });
    await this._updateClusterState(this._clusterNames().PowerSource, this.device.getMatterBatteryState());

    if (this._shouldExposeServiceArea()) {
      this.selectedAreaIds = this.selectedAreaIds.filter(areaId => this.areaIdToRoom.has(areaId));
      this._updateContext();
      await this._updateClusterState(SERVICE_AREA_CLUSTER_NAME, {
        supportedAreas: matterAreasFromRooms(this.normalizedRooms),
        selectedAreas: this.selectedAreaIds
      });
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
    const discoveredRooms = await this.device.discoverMatterRooms();
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
        supportedMaps: [],
        supportedAreas: matterAreasFromRooms(this.normalizedRooms),
        selectedAreas: this.selectedAreaIds
      };
    }
  }

  _shouldExposeServiceArea() {
    return this.device.supportsMatterRoomCleaning() || this._getConfiguredRooms().length > 0 || this.cachedRooms.length > 0 || this.normalizedRooms.length > 0;
  }

  _shouldDiscoverRooms() {
    return this.config.matterRoomDiscovery !== 'disabled' && this.device.supportsMatterRoomCleaning();
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
    const restoredSelectedAreas = this.restoredMatterAccessory &&
      this.restoredMatterAccessory.clusters &&
      this.restoredMatterAccessory.clusters.serviceArea &&
      this.restoredMatterAccessory.clusters.serviceArea.selectedAreas;
    const selectedAreaIds = Array.isArray(restoredSelectedAreas) ? restoredSelectedAreas : this.config.selectedAreaIds;
    if (!Array.isArray(selectedAreaIds)) {
      return [];
    }

    return [...new Set(selectedAreaIds.filter(areaId => this.areaIdToRoom.has(areaId)))];
  }

  _createAreaIdRoomMap(rooms) {
    const areaIdToRoom = new Map();
    rooms.forEach(room => areaIdToRoom.set(room.areaId, room));
    return areaIdToRoom;
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
      ...(this.api.matter.clusterNames || {})
    };
  }

  _localClusterName(clusterName) {
    const names = this._clusterNames();
    if (clusterName === names.RvcRunMode) return 'rvcRunMode';
    if (clusterName === names.RvcCleanMode) return 'rvcCleanMode';
    if (clusterName === names.RvcOperationalState) return 'rvcOperationalState';
    if (clusterName === names.PowerSource) return 'powerSource';
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
