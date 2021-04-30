const Properties = require('../../constants/Properties.js');

const AirPurifierProperties = {
  FAVORITE_SPEED: 'favorite_speed',
  FAVORITE_LEVEL: 'favorite_level',
  PM25_DENSITY: 'pm25_density',
  FILTER_LIFE_LEVEL: 'filter_life_level',
  FILTER_USED_TIME: 'filter_used_time',
  AQI_STATE: 'aqi_state',
  AQI_VALUE: 'aqi_value'
};

module.exports = {...Properties, ...AirPurifierProperties};
