const Actions = require('../../constants/Actions.js');

const FreshAirSystemActions = {
  RESET_HIGH_EFF_FILTER_LIFE: 'reset_high_eff_filter_life'
};

module.exports = {...Actions, ...FreshAirSystemActions};
