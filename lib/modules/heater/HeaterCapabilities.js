const Capabilities = require('../../constants/Capabilities.js');

const HeaterCapabilities = {
  TARGET_TEMPERATURE_RANGE: 'targetTemperatureRAnge',
};

module.exports = {...Capabilities, ...HeaterCapabilities};
