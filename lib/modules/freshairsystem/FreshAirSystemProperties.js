const Properties = require('../../constants/Properties.js');

const FreshAirSystemProperties = {
  FAN_LEVEL: 'fan_level',
  HEATER: 'heater',
  FILTER_LIFE_LEVEL: 'filter_life_level',
  FILTER_USED_TIME: 'filter_used_time',
  MOTOR_A_SPEED_RPM: 'motor_a_speed_rpm',
  MOTOR_B_SPEED_RPM: 'motor_b_speed_rpm'
};

module.exports = {...Properties, ...FreshAirSystemProperties};
