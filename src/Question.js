import util from 'util';

/**
* @cfg {*} item The item to be interrogated (item in Question, get it?).
* @cfg {Boolean} negative
* @cfg {Boolean} eventual
*/
function Question(item, negative, eventual) {

  this.item = item;
  this.actual = item;

  // TODO Making every permutation is dumb.  Be smarter.
  this.eventual = !!eventual;
  if (!this.eventual) {
    this.eventually = new Question(item, negative, true);
  }

  this.negative = !!negative;
  if (!this.negative) {
    this.not = new Question(item, true, eventual);
  }
};

/**
* Tests truth of an expression based on if the
* Question has been negated.
* @param {*} expression
* @return {Boolean}
*/
Question.prototype.isTrue = function (expression) {
  return this.negative ? !expression : !!expression;
};

/**
* Get a formatted string for an error.
* @return {String}
*/
Question.prototype.getErrorMessage = function () {
  // var msg = 'expected ' + util.inspect(this.actual);
  var actualIsComplex = Array.isArray(this.actual) ||
    Object.prototype.toString() === '[object Object]';

  var actualBuffer = actualIsComplex ? '\n' : '';

  var expectedIsComplex = Array.isArray(this.expected) ||
    Object.prototype.toString() === '[object Object]';

  var expectedBuffer = expectedIsComplex ? '\n' : '';

  var msg = 'expected ' + actualBuffer +
    util.inspect(this.actual) + actualBuffer;

  if (this.negative) {
    msg += ' not';
  }

  msg += ' to ' + this.explanation;

  if (this.hasExpected) {
    msg += ' ' + expectedBuffer + util.inspect(this.expected);
  }

  return msg;
};

/**
* @param {String} comparison text version of comparison
* @param {*} values item was tested against
* @return {Error}
*/
Question.prototype.getError = function (comparison, values) {
  return new Error(this.getErrorMessage(comparison, values));
};

/**
* Run the test and throw or return a promise.
* @param {Function} testCallback
* @param {String} message
* @param {*} criteria
* @return {Q.Promise/Question} When `eventually` is used, this is a Q.Promise.
* Otherwise, this is a `Question`.
*/
Question.prototype.if = function (testCallback, message, criteria) {
  var that = this;

  if (this.eventual) {
    // `this.item` is a promise

    // Return our own promise so we can deal with the
    // promise being tested.
    return new Promise(function (resolve, reject) {

      // Add to the end of the test's promise so we can
      // get the resolved value.
      that.item.then(

        // promise fulfilled, let's test it
        function (value) {

          // Now that the promise has been fulfilled,
          // change `this.actual` to the value, rather than
          // the promise.
          that.promise = that.actual;
          that.actual = value;

          if (!that.isTrue(testCallback())) {
            reject(that.getErrorMessage(message));
          } else {
            resolve(that.actual);
          }
        },

        // The promise threw an error.
        function (err) {
          reject('You broke your promise. :(\n"' + err + '"');
        }
      );
    });
  } else {

    if (!this.isTrue(testCallback(this.item))) {
      throw this.getError(message, criteria);
    } else {
      return this;
    }
  }
};

export default Question;
