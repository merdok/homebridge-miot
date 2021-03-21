const Capabilities = require('../../constants/Capabilities.js');

const CeilingFanCapabilities = {
  FAN_LEVELS: 'fanLevels',
  AUTO_MODE_VALUE: 'autoModeValue'
};

module.exports = {...Capabilities, ...CeilingFanCapabilities};
