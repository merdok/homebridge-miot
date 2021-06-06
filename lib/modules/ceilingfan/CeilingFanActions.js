const Actions = require('../../constants/Actions.js');

const CeilingFanActions = {
  BRIGHTNESS_UP: 'brightness_up',
  BRIGHTNESS_DOWN: 'brightness_down',
  BRIGHTNESS_CYCLE: 'brightness_cycle',
  COLOR_TEMP_CYCLE: 'color_temp_cycle',
  COLOR_TEMP_INCREASE: 'color_temp_increase',
  COLOR_TEMP_DECREASE: 'color_temp_decrease',
  ON_OR_BRIGHT_CYCLE: 'on_or_bright_cycle',
  ON_OR_COLOR_TEMP_CYCLE: 'on_or_color_temp_cycle',
  FAN_GEAR_CYCLE: 'fan_gear_cycle',
  SET_SCENE: 'set_scene'
};

module.exports = {...Actions, ...CeilingFanActions};
