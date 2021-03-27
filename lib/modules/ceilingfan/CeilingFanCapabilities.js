const Capabilities = require('../../constants/Capabilities.js');

const CeilingFanCapabilities = {
  AUTO_MODE_VALUE: 'autoModeValue',
  FAKE_STEPLESS_FAN_CONTROL: 'fakeSteplessFanControl'
};

module.exports = {...Capabilities, ...CeilingFanCapabilities};
