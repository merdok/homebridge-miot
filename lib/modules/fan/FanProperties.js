const Properties = require('../../constants/Properties.js');

const FanProperties = {
  FAN_SPEED: 'fan_speed',
  FAN_SPEED_RPM: 'rotation_speed_rpm',
  FAN_LEVEL: 'fan_level',
  HORIZONTAL_SWING: 'horizontal_swing',
  HORIZONTAL_SWING_ANGLE: 'horizontal_swing_angle',
  VERTICAL_SWING: 'vertical_swing',
  VERTICAL_SWING_ANGLE: 'vertical_swing_angle',
  MODE: 'mode',
  POWER_OFF_TIME: 'power_off_time',
  ALARM: 'alarm',
  LIGHT: 'light',
  ANION: 'anion',
  RELATIVE_HUMIDITY: 'relative_humidity',
  TEMPERATURE: 'temperature',
  BATTERY_POWER: 'battery_power',
  AC_POWER: 'ac_power',
  BATTERY_LEVEL: 'battery_level',
  COUNTRY_CODE: 'country_code',
  USE_TIME: 'use_time',
  HORIZONTAL_MOVE: 'set_move_horizontal',
  VERTICAL_MOVE: 'set_move_vertical',
  LP_ENTER_SECOND: 'set_lp_enter_second'
};

module.exports = {...Properties, ...FanProperties};
