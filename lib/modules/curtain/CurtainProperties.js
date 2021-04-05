const Properties = require('../../constants/Properties.js');

const CurtainProperties = {
  MOTOR_CONTROL: 'motor_control',
  CURRENT_POSITION: 'current_position',
  TARGET_POSITION: 'target_position',
  MOTOR_REVERSE: 'motor_reverse'
};

module.exports = {...Properties, ...CurtainProperties};
