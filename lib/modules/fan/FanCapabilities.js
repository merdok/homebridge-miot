const Capabilities = require('../../constants/Capabilities.js');

const FanCapabilities = {
  FAN_LEVELS: 'fanLevels',
  HORIZONTAL_SWING_LEVELS: 'horizontalSwingLevels',
  NATURAL_MODE: 'naturalMode',
  SLEEP_MODE: 'sleepMode',
  FAKE_STEPLESS_FAN_CONTROL: 'fakeSteplessFanControl'
};

module.exports = {...Capabilities, ...FanCapabilities};
