const Capabilities = require('../../constants/Capabilities.js');

const AirPurifierCapabilities = {
  AUTO_MODE_VALUE: 'autoModeValue',
  SLEEP_MODE_VALUE: 'sleepModeValue',
  FAVORITE_MODE_VALUE: 'favoriteModeValue',
  NONE_MODE_VALUE: 'noneModeValue'
};

module.exports = {...Capabilities, ...AirPurifierCapabilities};
