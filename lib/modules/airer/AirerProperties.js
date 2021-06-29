const Properties = require('../../constants/Properties.js');

const AirerProperties = {
  MOTOR_CONTROL: 'motor_control',
  CURRENT_POSITION: 'current_position',
  TARGET_POSITION: 'target_position',
  LIGHT_POWER: 'light_power'
};

module.exports = {...Properties, ...AirerProperties};
