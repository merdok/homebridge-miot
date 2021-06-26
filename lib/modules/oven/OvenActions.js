const Actions = require('../../constants/Actions.js');

const OvenActions = {
  PAUSE: 'pause',
  START_COOK: 'start_cook',
  CANCEL_COOKING: 'cancel_cooking'
};

module.exports = {...Actions, ...OvenActions};
