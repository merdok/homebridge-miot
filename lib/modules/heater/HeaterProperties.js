const Properties = require('../../constants/Properties.js');

const HeaterProperties = {
  HEAT_LEVEL: 'heat_level',
  TARGET_TEMPERATURE: 'target_temperature'
};

module.exports = {...Properties, ...HeaterProperties};
