const IjaiVacuumV2 = require('./ijai.vacuum.v2.js');


class IjaiVacuumV1 extends IjaiVacuumV2 {

  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mi Robot Vacuum-Mop Pro';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:ijai-v1:1';
  }


  /*----------========== ROBOT CONTROL OVERRIDES ==========----------*/

  async goHome() {
    const goChargingAction = this.getAction('sweep:set-go-charging');
    if (goChargingAction) {
      return this.fireActionStrict(goChargingAction, [1]);
    }
    return super.goHome();
  }

  async pauseCleaning() {
    if (this.stopSweepAction()) {
      return this.fireActionStrict(this.stopSweepAction());
    }
    return super.pauseCleaning();
  }

  getOperationalStateFlags() {
    const flags = super.getOperationalStateFlags();
    const hasActiveState = flags.isWorking || flags.isPaused || flags.isGoCharging || flags.isFullyCharged || flags.isCharging || flags.isDocked;
    return hasActiveState ? { ...flags, hasFault: false, isError: false } : flags;
  }

}

module.exports = IjaiVacuumV1;
