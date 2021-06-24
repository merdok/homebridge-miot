const Properties = require('../../constants/Properties.js');

const FreshAirSystemProperties = {
  HEATER: 'heater',
  FILTER_LIFE_LEVEL: 'filter_life_level',
  FILTER_USED_TIME: 'filter_used_time',
  FILTER_LEFT_TIME: 'filter_left_time',
  MOTOR_A_SPEED_RPM: 'motor_a_speed_rpm',
  MOTOR_B_SPEED_RPM: 'motor_b_speed_rpm',
  PM25_DENSITY: 'pm25_density',
  CO2_DENSITY: 'co2_density'
};

module.exports = {...Properties, ...FreshAirSystemProperties};
