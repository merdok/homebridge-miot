const Capabilities = require('../../constants/Capabilities.js');

const CeilingFanCapabilities = {
  FAKE_STEPLESS_FAN_CONTROL: 'fakeSteplessFanControl'
};

module.exports = {...Capabilities, ...CeilingFanCapabilities};
