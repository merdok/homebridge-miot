const Actions = require('../../constants/Actions.js');

const RobotCleanerActions = {
  START_SWEEP: 'start_sweep',
  STOP_SWEEP: 'stop_sweep',
  PAUSE_SWEEP: 'pause_sweep',
  START_MOP: 'start_mop',
  START_SWEEP_MOP: 'start_sweep_mop',
  START_ROOM_SWEEP: 'start_room_sweep',
  RESET_BRUSH_LIFE: 'reset_brush_life',
  RESET_SIDE_BRUSH_LIFE: 'reset_side_brush_life',
  START_CLEAN: 'start_clean',
  STOP_CLEAN: 'stop_clean',
  PLAY_SOUND: 'play_sound',
  LOCATE_ROBOT: 'locate_robot'
};

module.exports = {...Actions, ...RobotCleanerActions};
