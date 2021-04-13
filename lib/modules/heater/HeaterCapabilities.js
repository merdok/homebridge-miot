const Capabilities = require('../../constants/Capabilities.js');

const HeaterCapabilities = {
  FAN_SWING_MODE_VALUE: 'fanSwingModeValue',
  FAN_NOT_SWING_MODE_VALUE: 'fanNotSwingModeValue'
};

module.exports = {...Capabilities, ...HeaterCapabilities};
