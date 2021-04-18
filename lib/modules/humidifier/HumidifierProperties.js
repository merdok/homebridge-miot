const Properties = require('../../constants/Properties.js');

const HumidifierProperties = {
  TARGET_HUMIDITY: 'target_humidity',
  WATER_LEVEL: 'water_level',
  DRY: 'dry',
  TEMPERATURE_FAHRENHEIT: 'temperature_fahrenheit',
  SCREEN: 'screen',
  ACTUAL_SPEED: 'actual_speed',
  POWER_TIME: 'power_time'
};

module.exports = {...Properties, ...HumidifierProperties};
