const Properties = require('../../constants/Properties.js');

const FanProperties = {
  HORIZONTAL_SWING: 'horizontal_swing',
  HORIZONTAL_SWING_ANGLE: 'horizontal_swing_angle',
  VERTICAL_SWING: 'vertical_swing',
  VERTICAL_SWING_ANGLE: 'vertical_swing_angle',
  ANION: 'anion',
  HORIZONTAL_MOVE: 'set_move_horizontal',
  VERTICAL_MOVE: 'set_move_vertical',
  LP_ENTER_SECOND: 'set_lp_enter_second'
};

module.exports = {...Properties, ...FanProperties};
