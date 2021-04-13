const Capabilities = require('../../constants/Capabilities.js');

const FreshAirSystemCapabilities = {
  FAKE_STEPLESS_FAN_CONTROL: 'fakeSteplessFanControl'
};

module.exports = {...Capabilities, ...FreshAirSystemCapabilities};
