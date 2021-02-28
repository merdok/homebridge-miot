const Capabilities = require('../../constants/Capabilities.js');

const HeaterCapabilities = {
  TARGET_TEMPERATURE_RANGE: 'targetTemperatureRange'
};

module.exports = {...Capabilities, ...HeaterCapabilities};
