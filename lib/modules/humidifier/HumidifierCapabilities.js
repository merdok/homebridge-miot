const Capabilities = require('../../constants/Capabilities.js');

const HumidifierCapabilities = {
  FAN_LEVELS: 'fanLevels'
};

module.exports = {...Capabilities, ...HumidifierCapabilities};
