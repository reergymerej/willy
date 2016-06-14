var testInstanceOf = function () {
  var expression;

  switch (this.expected) {
    case String:
      expression = typeof this.actual === 'string';
      break;
    case Number:
      expression = typeof this.actual === 'number';
      break;
    case Boolean:
      expression = typeof this.actual === 'boolean';
      break;
    default:
      expression = this.actual instanceof this.expected;
  }

  return expression;
};


/**
* Tests inheritance
* @param {Function} criterion
*/
exports.beA = {
  name: 'beA',
  fn: testInstanceOf
};

/**
* Tests inheritance
* @param {Function} criterion
*/
exports.beAn = {
  name: 'beAn',
  fn: testInstanceOf
};
