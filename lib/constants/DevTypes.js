const ALL_DEVICES = {};

ALL_DEVICES.UNKNOWN = {
  'type': 'Unknown',
  'specTypes': []
}

ALL_DEVICES.CUSTOM = {
  'type': 'Custom',
  'specTypes': []
}

ALL_DEVICES.FAN = {
  'type': 'Fan',
  'specTypes': ['Fan']
}

ALL_DEVICES.HEATER = {
  'type': 'Heater',
  'specTypes': ['Heater', 'Electric Blanket', 'electric-blanket']
}

ALL_DEVICES.HUMIDIFIER = {
  'type': 'Humidifier',
  'specTypes': ['Humidifier']
}

ALL_DEVICES.AIR_PURIFIER = {
  'type': 'AirPurifier',
  'specTypes': ['Air Purifier']
}

ALL_DEVICES.CEILING_FAN = {
  'type': 'CeilingFan',
  'specTypes': ['Ceiling Fan']
}

ALL_DEVICES.OUTLET = {
  'type': 'Outlet',
  'specTypes': ['Outlet']
}

ALL_DEVICES.CURTAIN = {
  'type': 'Curtain',
  'specTypes': ['Curtain']
}

ALL_DEVICES.FRESH_AIR_SYSTEM = {
  'type': 'FreshAirSystem',
  'specTypes': ['Fresh Air System']
}

ALL_DEVICES.ROBOT_CLEANER = {
  'type': 'RobotCleaner',
  'specTypes': ['Robot Cleaner']
}

ALL_DEVICES.DEHUMIDIFIER = {
  'type': 'Dehumidifier',
  'specTypes': ['Dehumidifier']
}

ALL_DEVICES.LIGHT = {
  'type': 'Light',
  'specTypes': ['Light']
}

ALL_DEVICES.AIR_CONDITIONER = {
  'type': 'AirConditioner',
  'specTypes': ['Air Conditioner', 'Air Condition Outlet', 'air-condition-outlet', 'Microwave Oven', 'microwave-oven']
}

ALL_DEVICES.AIRER = {
  'type': 'Airer',
  'specTypes': ['Airer']
}

ALL_DEVICES.OVEN = {
  'type': 'Oven',
  'specTypes': ['Oven', 'Air Fryer', 'air-fryer']
}

ALL_DEVICES.COFFEE_MACHINE = {
  'type': 'CoffeeMachine',
  'specTypes': ['Coffee Machine']
}

ALL_DEVICES.CAMERA = {
  'type': 'Camera',
  'specTypes': ['Camera']
}

ALL_DEVICES.BATH_HEATER = {
  'type': 'BathHeater',
  'specTypes': ['Bath Heater', 'Water Heater', 'water-heater']
}

ALL_DEVICES.KETTLE = {
  'type': 'Kettle',
  'specTypes': ['Kettle', 'Health Pot', 'health-pot']
}

ALL_DEVICES.THERMOSTAT = {
  'type': 'Thermostat',
  'specTypes': ['Thermostat']
}

ALL_DEVICES.SWITCH = {
  'type': 'Switch',
  'specTypes': ['Switch']
}

ALL_DEVICES.AIR_MONITOR = {
  'type': 'AirMonitor',
  'specTypes': ['Air Monitor', 'air-monitor']
}

ALL_DEVICES.COOKER = {
  'type': 'Cooker',
  'specTypes': ['Cooker', 'cooker']
}

const identifyDeviceBySpecType = (specType) => {
  if (specType) {
    let devTypeKey = Object.keys(ALL_DEVICES).find(devTypeKey => ALL_DEVICES[devTypeKey].specTypes.map(item => item.toLowerCase()).includes(specType.toLowerCase()));
    if (devTypeKey) {
      return ALL_DEVICES[devTypeKey].type;
    }
  }
  return null;
}

module.exports.UNKNOWN = ALL_DEVICES.UNKNOWN.type;
module.exports.CUSTOM = ALL_DEVICES.CUSTOM.type;
module.exports.FAN = ALL_DEVICES.FAN.type;
module.exports.HEATER = ALL_DEVICES.HEATER.type;
module.exports.HUMIDIFIER = ALL_DEVICES.HUMIDIFIER.type;
module.exports.AIR_PURIFIER = ALL_DEVICES.AIR_PURIFIER.type;
module.exports.CEILING_FAN = ALL_DEVICES.CEILING_FAN.type;
module.exports.OUTLET = ALL_DEVICES.OUTLET.type;
module.exports.CURTAIN = ALL_DEVICES.CURTAIN.type;
module.exports.FRESH_AIR_SYSTEM = ALL_DEVICES.FRESH_AIR_SYSTEM.type;
module.exports.ROBOT_CLEANER = ALL_DEVICES.ROBOT_CLEANER.type;
module.exports.DEHUMIDIFIER = ALL_DEVICES.DEHUMIDIFIER.type;
module.exports.LIGHT = ALL_DEVICES.LIGHT.type;
module.exports.AIR_CONDITIONER = ALL_DEVICES.AIR_CONDITIONER.type;
module.exports.AIRER = ALL_DEVICES.AIRER.type;
module.exports.OVEN = ALL_DEVICES.OVEN.type;
module.exports.COFFEE_MACHINE = ALL_DEVICES.COFFEE_MACHINE.type;
module.exports.CAMERA = ALL_DEVICES.CAMERA.type;
module.exports.BATH_HEATER = ALL_DEVICES.BATH_HEATER.type;
module.exports.KETTLE = ALL_DEVICES.KETTLE.type;
module.exports.THERMOSTAT = ALL_DEVICES.THERMOSTAT.type;
module.exports.SWITCH = ALL_DEVICES.SWITCH.type;
module.exports.AIR_MONITOR = ALL_DEVICES.AIR_MONITOR.type;
module.exports.COOKER = ALL_DEVICES.COOKER.type;
module.exports.identifyDeviceBySpecType = identifyDeviceBySpecType;
