const Properties = require('../../constants/Properties.js');

const FreshAirSystemProperties = {
  HEATER: 'heater',
  HEAT_LEVEL: 'heat_level',
  FILTER_LIFE_LEVEL: 'filter_life_level',
  FILTER_USED_TIME: 'filter_used_time',
  FILTER_LEFT_TIME: 'filter_left_time',
  HIGH_EFF_FILTER_LIFE_LEVEL: 'high_eff_filter_life_level',
  HIGH_EFF_FILTER_LEFT_TIME: 'high_eff_filter_left_time',
  MOTOR_A_SPEED_RPM: 'motor_a_speed_rpm',
  MOTOR_B_SPEED_RPM: 'motor_b_speed_rpm'
};

module.exports = {...Properties, ...FreshAirSystemProperties};
