const Properties = require('../../constants/Properties.js');

const AirPurifierProperties = {
  MODE: 'mode',
  FAN_LEVEL: 'fanLevel',
  FAVORITE_SPEED: 'favoriteSpeed',
  PM25_DENSITY: 'pm25density',
  FILTER_LIFE_LEVEL: 'filterLifeLevel',
  FILTER_USED_TIME: 'filterUsedTime',
  FAN_SPEED_RPM: 'fanSpeedRpm',
  AQI_STATE: 'aqiState',
  AQI_VALUE: 'aqiValue'
};

module.exports = {...Properties, ...AirPurifierProperties};
