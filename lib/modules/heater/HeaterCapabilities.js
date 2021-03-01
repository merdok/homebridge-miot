const Capabilities = require('../../constants/Capabilities.js');

const HeaterCapabilities = {
  TARGET_TEMPERATURE_RANGE: 'targetTemperatureRange',
  HEAT_LEVELS: 'heatLevels',
  AUTO_MODE_VALUE: 'autoModeValue',
  HEAT_MODE_VALUE: 'heatModeValue',
  COOL_MODE_VALUE: 'coolModeValue',
  FAN_SWING_MODE_VALUE: 'fanSwingModeValue',
  FAN_NOT_SWING_MODE_VALUE: 'fanNotSwingModeValue'
};

module.exports = {...Capabilities, ...HeaterCapabilities};
