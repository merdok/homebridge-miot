const Properties = require('../../constants/Properties.js');

const AirConditionerProperties = {
  TARGET_TEMPERATURE: 'target_temperature',
  SWITCH_STATUS_2: 'switch_status_2'
};

module.exports = {...Properties, ...AirConditionerProperties};
