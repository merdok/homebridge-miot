const Capabilities = require('../../constants/Capabilities.js');

const FanCapabilities = {
  FAN_LEVELS: 'fanLevels',
  HORIZONTAL_SWING_ANGLE_RANGE: 'horizontalSwingAngleRange',
  HORIZONTAL_SWING_LEVELS: 'horizontalSwingLevels',
  VERTICAL_SWING_ANGLE_RANGE: 'verticalSwingAngleRange',
  NATURAL_MODE: 'naturalMode',
  SLEEP_MODE: 'sleepMode'
};

module.exports = {...Capabilities, ...FanCapabilities};
