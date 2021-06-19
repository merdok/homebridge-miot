const Properties = require('../../constants/Properties.js');

const AirerProperties = {
  MOTOR_CONTROL: 'motor_control',
  CURRENT_POSITION: 'current_position',
  TARGET_POSITION: 'target_position',
  TARGET_POSITION_2: 'target_position_2',
  LIGHT_POWER: 'light_power'
};

module.exports = {...Properties, ...AirerProperties};
