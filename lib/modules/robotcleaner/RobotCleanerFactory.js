const DreameVacuumP2008 = require('./devices/dreame.vacuum.p2008.js');
const DreameVacuumMC1808 = require('./devices/dreame.vacuum.mc1808.js');
const RoborockVacuumA15 = require('./devices/roborock.vacuum.a15.js');
const RoborockVacuumA11 = require('./devices/roborock.vacuum.a11.js');
const RoborockVacuumM1S = require('./devices/roborock.vacuum.m1s.js');
const DreameVacuumP2009 = require('./devices/dreame.vacuum.p2009.js');
const ViomiVacuumV10 = require('./devices/viomi.vacuum.v10.js');
const DreameVacuumP2041 = require('./devices/dreame.vacuum.p2041.js');
const MijiaVacuumV2 = require('./devices/mijia.vacuum.v2.js');
const DreameVacuumP2028 = require('./devices/dreame.vacuum.p2028.js');
const DreameVacuumP2036 = require('./devices/dreame.vacuum.p2036.js');
const RoborockVacuumV1 = require('./devices/rockrobo.vacuum.v1.js');
const DreameVacuumP2029 = require('./devices/dreame.vacuum.p2029.js');
const DreameVacuumP2140 = require('./devices/dreame.vacuum.p2140.js');

const allDevices = [DreameVacuumP2008, DreameVacuumMC1808, RoborockVacuumA15, RoborockVacuumA11,
  RoborockVacuumM1S, DreameVacuumP2009, ViomiVacuumV10, DreameVacuumP2041,
  MijiaVacuumV2, DreameVacuumP2028, DreameVacuumP2036, RoborockVacuumV1,
  DreameVacuumP2029, DreameVacuumP2140
];


class RobotCleanerFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = allDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = RobotCleanerFactory;
