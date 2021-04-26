const Properties = require('../../constants/Properties.js');

const DehumidifierProperties = {
  TARGET_HUMIDITY: 'target_humidity',
  WATER_TANK_STATUS: 'water_tank_status',
  COIL_TEMP: 'coil_temp',
  COMPRESSOR_STATUS: 'compressor_status',
  DEFROST_STATUS: 'defrost_status'
};

module.exports = {...Properties, ...DehumidifierProperties};
