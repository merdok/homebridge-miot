const IjaiVacuumV2 = require('./ijai.vacuum.v2.js');
const {
  MATTER_RVC_OPERATIONAL_STATES,
  parseRoomsFromUnknownPayload
} = require('../RobotCleanerMatterUtils.js');


class IjaiVacuumV1 extends IjaiVacuumV2 {

  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mi Robot Vacuum-Mop Pro';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:ijai-v1:1';
  }


  /*----------========== MATTER OVERRIDES ==========----------*/

  async sendMatterGoHome() {
    const goChargingAction = this.getAction('sweep:set-go-charging');
    if (goChargingAction) {
      return this.fireActionStrict(goChargingAction, [1]);
    }
    return super.sendMatterGoHome();
  }

  async pauseMatterCleaning() {
    if (this.stopSweepAction()) {
      return this.fireActionStrict(this.stopSweepAction());
    }
    return super.pauseMatterCleaning();
  }

  getMatterOperationalState() {
    if (this.isVacuumWorking()) {
      return MATTER_RVC_OPERATIONAL_STATES.RUNNING;
    }
    if (this.isStatusPause()) {
      return MATTER_RVC_OPERATIONAL_STATES.PAUSED;
    }
    if (this.isStatusGoCharging()) {
      return MATTER_RVC_OPERATIONAL_STATES.SEEKING_CHARGER;
    }
    if (this.isStatusCharging()) {
      return MATTER_RVC_OPERATIONAL_STATES.CHARGING;
    }
    if (this.isStatusChargingCompleted()) {
      return MATTER_RVC_OPERATIONAL_STATES.DOCKED;
    }
    return super.getMatterOperationalState();
  }

  async discoverMatterRooms() {
    const rooms = await this._discoverCurrentMapRooms();
    if (rooms.length > 0) {
      return this._dedupeMatterRooms([
        ...rooms,
        ...this._discoverRoomsFromCachedProperties()
      ]);
    }

    return super.discoverMatterRooms();
  }

  async _discoverCurrentMapRooms() {
    if (!this.isLocallyConnected()) {
      return [];
    }

    const currentMapId = await this._getCurrentIjaiMapId();
    const roomListAction = this.getAction('map:get-map-room-list');
    if (!currentMapId || !roomListAction) {
      return [];
    }

    try {
      const result = await this.fireActionStrict(roomListAction, [currentMapId]);
      const roomPayload = this._getActionOutValue(result, 17);
      return parseRoomsFromUnknownPayload(roomPayload).map(room => ({
        ...room,
        mapId: String(currentMapId)
      }));
    } catch (err) {
      this.logger.debug(`IJAI current map room discovery failed: ${err.message}`);
      return [];
    }
  }

  async _getCurrentIjaiMapId() {
    const currentMapId = this._getCurrentMapId();
    if (currentMapId) {
      return currentMapId;
    }

    const mapListAction = this.getAction('map:get-map-list');
    if (!mapListAction) {
      return null;
    }

    const result = await this.fireActionStrict(mapListAction, []);
    const mapListPayload = this._getActionOutValue(result, 4);
    const maps = this._parseIjaiJsonArray(mapListPayload);
    const currentMap = maps.find(map => map && map.cur === true) || maps[0];
    return currentMap && currentMap.id ? currentMap.id : null;
  }

  _parseIjaiJsonArray(value) {
    if (typeof value !== 'string' || value.length === 0) {
      return [];
    }
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

}

module.exports = IjaiVacuumV1;
