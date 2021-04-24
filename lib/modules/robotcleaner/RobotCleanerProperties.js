const Properties = require('../../constants/Properties.js');

const RobotCleanerProperties = {
  MOP_MODE: 'mop_mode',
  BRUSH_LEFT_TIME: 'brush_left_time',
  BRUSH_LIFE_LEVEL: 'brush_life_level',
  SIDE_BRUSH_LEFT_TIME: 'side_brush_left_time',
  SIDE_BRUSH_LIFE_LEVEL: 'side_brush_life_level',
  FILTER_LIFE_LEVEL: 'filter_life_level',
  FILTER_LEFT_TIME: 'filter_left_time',
  WORK_MODE: 'work_mode',
  CLEANING_TIME: 'cleaning_time',
  CLEANING_AREA: 'cleaning_area',
  TOTAL_CLEAN_TIME: 'total_clean_time',
  TOTAL_CLEAN_TIMES: 'total_clean_times',
  TOTAL_CLEAN_AREA: 'total_clean_area'
};

module.exports = {...Properties, ...RobotCleanerProperties};
