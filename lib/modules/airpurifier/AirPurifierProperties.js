const Properties = require('../../constants/Properties.js');

const AirPurifierProperties = {
  FAVORITE_SPEED: 'favorite_speed',
  FAVORITE_LEVEL: 'favorite_level',
  FILTER_LIFE_LEVEL: 'filter_life_level',
  FILTER_USED_TIME: 'filter_used_time',
  FILTER_LEFT_TIME: 'filter_left_time',
  AQI_STATE: 'aqi_state',
  AQI_VALUE: 'aqi_value'
};

module.exports = {...Properties, ...AirPurifierProperties};
