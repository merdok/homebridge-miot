const Properties = require('../../constants/Properties.js');

const CeilingFanProperties = {
  FAN_LEVEL: 'fan_level',
  FAN_SPEED: 'fan_speed',
  MODE: 'mode',
  LIGHT_POWER: 'light_power',
  LIGHT_MODE: 'light_mode',
  BRIGHTNESS: 'brightness',
  COLOR_TEMP: 'color_temp',
  LIGHT_POWER_OFF_TIME: 'light_power_off_time',
  STATUS: 'status'
};

module.exports = {...Properties, ...CeilingFanProperties};
