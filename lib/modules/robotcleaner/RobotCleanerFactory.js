const DreameVacuumP2008 = require('./devices/dreame.vacuum.p2008.js');


class RobotCleanerFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;

    if (deviceModel) {
      if (deviceModel.includes('dreame.vacuum.p2008')) {
        deviceFactoryClass = DreameVacuumP2008;
      }
    }

    return deviceFactoryClass;
  }

}

module.exports = RobotCleanerFactory;
