const Capabilities = require('../../constants/Capabilities.js');

const CurtainCapabilities = {
  STATUS_CLOSING_VALUE: 'statusClosingValue',
  STATUS_STOP_VALUE: 'statusStopValue',
  STATUS_OPENING_VALUE: 'statusOpeningValue',
};

module.exports = {...Capabilities, ...CurtainCapabilities};
