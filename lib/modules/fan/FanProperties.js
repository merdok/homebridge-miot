const Properties = require('../../constants/Properties.js');

const FanProperties = {
  FAN_SPEED: 'fan_speed',
  FAN_SPEED_RPM: 'rotation_speed_rpm',
  FAN_LEVEL: 'fan_level',
  HORIZONTAL_SWING: 'horizontal_swing',
  HORIZONTAL_SWING_ANGLE: 'horizontal_swing_angle',
  VERTICAL_SWING: 'vertical_swing',
  VERTICAL_SWING_ANGLE: 'vertical_swing_angle',
  MODE: 'mode',
  ANION: 'anion',
  HORIZONTAL_MOVE: 'set_move_horizontal',
  VERTICAL_MOVE: 'set_move_vertical',
  LP_ENTER_SECOND: 'set_lp_enter_second'
};

module.exports = {...Properties, ...FanProperties};
