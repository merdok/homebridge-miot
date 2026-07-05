const IjaiVacuumV2 = require('./ijai.vacuum.v2.js');
const {
  MATTER_RVC_OPERATIONAL_STATES
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

}

module.exports = IjaiVacuumV1;
