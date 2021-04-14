const Properties = require('../../constants/Properties.js');

const CeilingFanProperties = {
  LIGHT_POWER: 'light_power',
  LIGHT_MODE: 'light_mode',
  LIGHT_POWER_OFF_TIME: 'light_power_off_time'
};

module.exports = {...Properties, ...CeilingFanProperties};
