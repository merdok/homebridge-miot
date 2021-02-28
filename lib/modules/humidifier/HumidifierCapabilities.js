const Capabilities = require('../../constants/Capabilities.js');

const HumidifierCapabilities = {
  FAN_LEVELS: 'fanLevels',
  TARGET_HUMIDITY_RANGE: 'targetHumidityRange',
  WATER_LEVEL_RANGE: 'waterLevelRange'
};

module.exports = {...Capabilities, ...HumidifierCapabilities};
