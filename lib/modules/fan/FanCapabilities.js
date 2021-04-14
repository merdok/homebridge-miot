const Capabilities = require('../../constants/Capabilities.js');

const FanCapabilities = {
  HORIZONTAL_SWING_LEVELS: 'horizontalSwingLevels',
  STRAIGHT_WIND_MODE_VALUE: 'straightWindModeValue',
  NATURAL_MODE_VALUE: 'naturalModeValue',
  SLEEP_MODE_VALUE: 'sleepModeValue'
};

module.exports = {...Capabilities, ...FanCapabilities};
