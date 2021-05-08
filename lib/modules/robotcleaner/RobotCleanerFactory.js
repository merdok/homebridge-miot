const DreameVacuumP2008 = require('./devices/dreame.vacuum.p2008.js');
const DreameVacuumMC1808 = require('./devices/dreame.vacuum.mc1808.js');
const RoborockVacuumA15 = require('./devices/roborock.vacuum.a15.js');
const RoborockVacuumA11 = require('./devices/roborock.vacuum.a11.js');


class RobotCleanerFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;

    if (deviceModel) {
      if (deviceModel.includes('dreame.vacuum.p2008')) {
        deviceFactoryClass = DreameVacuumP2008;
      } else if (deviceModel.includes('dreame.vacuum.mc1808')) {
        deviceFactoryClass = DreameVacuumMC1808;
      } else if (deviceModel.includes('roborock.vacuum.a15')) {
        deviceFactoryClass = RoborockVacuumA15;
      } else if (deviceModel.includes('roborock.vacuum.a11')) {
        deviceFactoryClass = RoborockVacuumA11;
      }
    }

    return deviceFactoryClass;
  }

}

module.exports = RobotCleanerFactory;
