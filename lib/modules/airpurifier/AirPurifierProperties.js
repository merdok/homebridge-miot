const Properties = require('../../constants/Properties.js');

const AirPurifierProperties = {
  FAVORITE_SPEED: 'favorite_speed',
  PM25_DENSITY: 'pm25_density',
  FILTER_LIFE_LEVEL: 'filter_life_level',
  FILTER_USED_TIME: 'filter_used_time',
  FAN_SPEED_RPM: 'fan_speed_rpm',
  AQI_STATE: 'aqi_state',
  AQI_VALUE: 'aqi_value'
};

module.exports = {...Properties, ...AirPurifierProperties};
