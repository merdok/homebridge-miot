const Capabilities = require('../../constants/Capabilities.js');

const AirPurifierCapabilities = {
  FAN_LEVELS: 'fanLevels',
  AUTO_MODE_VALUE: 'autoModeValue',
  SLEEP_MODE_VALUE: 'sleepModeValue',
  FAVORITE_MODE_VALUE: 'favoriteModeValue',
  NONE_MODE_VALUE: 'noneModeValue',
  FAVORITE_SPEED_RANGE: 'favoriteSpeedRange',
  LIGHT_BRIGHTNESS_RANGE: 'lightBrightnessRange'
};

module.exports = {...Capabilities, ...AirPurifierCapabilities};
