const ALL_OPERATORS = {};

ALL_OPERATORS.EQUAL = {
  'type': 'equal',
  'values': ['equal', '=', '==']
};

ALL_OPERATORS.LESS = {
  'type': 'less',
  'values': ['less', 'below', '<']
};

ALL_OPERATORS.GREATER = {
  'type': 'greater',
  'values': ['greater', 'above', '>']
};

ALL_OPERATORS.LESS_OR_EQUAL = {
  'type': 'lessOrEqual',
  'values': ['lessOrEqual', 'belowOrEqual', '<=']
};

ALL_OPERATORS.GREATER_OR_EQUAL = {
  'type': 'greaterOrEqual',
  'values': ['greaterOrEqual', 'aboveOrEqual', '>=']
};

ALL_OPERATORS.CONTAINS = {
  'type': 'contains',
  'values': ['contains', '[]', '[]=']
};

const lookupByName = (operatorName) => {
  if (operatorName) {
    let operatorNameKey = Object.keys(ALL_OPERATORS).find(tmpKey => ALL_OPERATORS[tmpKey].values.includes(operatorName));
    if (operatorNameKey) {
      return ALL_OPERATORS[operatorNameKey].type;
    }
  }
  return ALL_OPERATORS.EQUAL.type;
}

module.exports.EQUAL = ALL_OPERATORS.EQUAL.type;
module.exports.LESS = ALL_OPERATORS.LESS.type;
module.exports.GREATER = ALL_OPERATORS.GREATER.type;
module.exports.LESS_OR_EQUAL = ALL_OPERATORS.LESS_OR_EQUAL.type;
module.exports.GREATER_OR_EQUAL = ALL_OPERATORS.GREATER_OR_EQUAL.type;
module.exports.CONTAINS = ALL_OPERATORS.CONTAINS.type;
module.exports.lookupByName = lookupByName;
