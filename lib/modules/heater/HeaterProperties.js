const Properties = require('../../constants/Properties.js');

const HeaterProperties = {
  TARGET_TEMPERATURE: 'target_temperature',
  POWER_OFF_TIME: 'power_off_time',
  ALARM: 'alarm',
  LIGHT: 'light',
  RELATIVE_HUMIDITY: 'relative_humidity',
  TEMPERATURE: 'temperature',
  USE_TIME: 'use_time',
};

module.exports = {...Properties, ...HeaterProperties};
