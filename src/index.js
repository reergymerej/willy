import Question from './Question';

/**
* @param {*} actual The value/function/expression being tested.
* @return {Question}
*/
export function will(actual) {
  return new Question(actual);
};

/**
* Derive an explanation from a function's name.
* @param {String} name
* @return {String}
*/
var getExplanation = function (name) {
  var regex = /([A-Z]|[0-9]+)/g;
  var indices = [0];
  var words = [];
  var result = regex.exec(name);

  while (result !== null) {
    indices.push(result.index);
    result = regex.exec(name);
  }

  // chop at the indices
  indices.forEach(function (from, index, collection) {
    var to = collection[index + 1];
    var length = to && to - from;

    words.push(name.substr(from, length).toLowerCase());
  });

  return words.join(' ');
};

/**
* Add a new test to the Question prototype.
* @param {Function/Object} fn a named function; If using an object,
* pass params as properties of the object.
* @param {String} [explanation] what you were expecting to be true
* If omitted, it will be constructed from the name of fn.
* @param {String} [fnName] Use when you want to use a reserved word
* for your test's name.
*/
export function define(fn, explanation, fnName) {

  // Handle alternate signature.
  if (typeof fn === 'object') {
    fnName = fn.name;
    explanation = fn.explanation;
    fn = fn.fn;
  }

  fnName = fnName || fn.name;
  explanation = explanation || getExplanation(fnName);

  if (!fnName) {
    // console.error(fn.toString());
    throw new Error('This test has no name.');
  }

  // Wrap the test in another function so we can
  // inject the actual and expected values.
  Question.prototype[fnName] = function (expected) {

    var that = this;

    that.expected = expected;
    that.hasExpected = arguments.length > 0;
    that.explanation = explanation;

    return this.if(
      function () {
        // Run the test using the Question's scope
        // to inject the values.
        return fn.call(that, expected);
      }
    );
  };
};

/**
* @param {Object} tests
*/
export function loadDefinitions(tests) {
  Object.keys(tests).forEach(function (test) {
    var definition = tests[test];
    definition.name = definition.name || definition.fn.name || test;
    define(definition);
  });
};

// load up the built in tests
loadDefinitions(require('./built-in'));

export default {
  define,
  loadDefinitions,
};
