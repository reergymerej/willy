'use strict';

var Q = require('q');

var E = {
    UNDEF: 'exist',
    INST: 'be an instance of',
    THROW: 'throw an error',
    NOT_IN_ARR: 'have all of these items:',
    EQ: 'be like',
    STRICT_EQ: 'strictly equal',
    NOT_IN_OBJ: 'have all of these properties:',
    HAVE_OWN: 'have own',
    HAVE_ANY_OBJ: 'have any of these properties:',
    HAVE_ANY_ARR: 'have any of these items:',
    ARR_HAS_EXTRA: 'have only these items:',
    OBJ_HAS_EXTRA: 'have only these properties:',
    MATCH: 'match RegExp:',
    BE_DEFINED: 'be defined',
    BE_UNDEFINED: 'be defined',
    BE_NULL: 'be null',
    BE_TRUTHY: 'be truthy',
    BE_FALSY: 'be falsy',
    BE_LESS_THAN: 'be less than',
    BE_GREATER_THAN: 'be greater than'
};

/**
* @return {Boolean} error thrown
*/
var mayThrow = function (fn) {
    var threw;
    try {
        fn();
    } catch (e) {
        threw = true;
    }
    
    return threw;
};

/**
* @cfg {*} item The item to be interrogated (item in Question, get it?).
* @cfg {Boolean} negative
* @cfg {Boolean} eventual
*/
var Question = function (item, negative, eventual) {

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
* Execute a function for each item.
* @param {Object/Array} item
* @param {Function} value, key - return false to stop
*/
var forEach = function (item, fn) {
    // TODO: use Object.keys, man
    var i,
        max;

    if (item instanceof Array) {
        for (i = 0, max = item.length; i < max; i++) {
            if (fn(item[i], i) === false) {
                break;
            }
        }
    } else {
        for (i in item) {
            if (item.hasOwnProperty(i)) {
                if (fn(item[i], i) === false) {
                    break;
                }
            }
        }
    }
};

/**
* Test for the presence of properties in an Object or Array.
* @param {Array} needles
* @param {Array/Object} collection
* @param {Boolean} all Only return true if all needles are found.
* @return {Boolean}
*/
var propertiesExist = function (needles, hayStack, all) {
    var result = true,
        isArray = hayStack instanceof Array,
        found;

    forEach(needles, function (value, key) {

        if (isArray) {
            found = hayStack.indexOf(value) !== -1;
        } else {
            found = hayStack[value] !== undefined;
        }

        if (all && !found) {
            result = false;
            return false;
        }
    });

    return result;
};

var allPropertiesExist = function (needles, hayStack) {
    return propertiesExist(needles, hayStack, true);
};

/**
* Test for the presence at least one property in an Object or Array.
* @param {Array} needles
* @param {Array/Object} collection
* @return {Boolean}
*/
var anyPropExists = function (needles, hayStack) {
    var result = false,
        isArray = hayStack instanceof Array;

    forEach(needles, function (value, key) {

        if (isArray) {
            result = hayStack.indexOf(value) !== -1;
        } else {
            result = hayStack[value] !== undefined;
        }

        return !result;
    });

    return result;
};

/**
* Test for the presence of properties unspecified properties.
* @param {String[]} needles
* @param {Array/Object} collection
* @return {Boolean}
*/
var onlyThesePropsExist = function (needles, hayStack) {
    var result = true,
        isArray = hayStack instanceof Array;

    forEach(hayStack, function (value, key) {
        var isNeedle;
        
        if (isArray) {
            isNeedle = needles.indexOf(value) !== -1;
        } else {
            isNeedle = needles.indexOf(key) !== -1;
        }

        if (!isNeedle) {
            result = false;
        }

        return isNeedle;
    });

    return result;
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
* @param {String} comparison text version of comparison
* @param {*} values item was tested against
* @return {String}
*/
Question.prototype.getErrorMessage = function (comparison, values) {
    var msg = 'expected <' + this.actual + '>';

    if (this.negative) {
        msg += ' not';
    }

    msg += ' to ' + this.explanation;

    if (this.hasExpected) {
        msg += ' <' + this.expected + '>';
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
        return Q.Promise(function (resolve, reject) {

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

/**
* @param {*} actual The value/function/expression being tested.
* @return {Question}
*/
var will = function (actual) {
    return new Question(actual);
};

var isPromise = function (x) {
    return !!(x.constructor.prototype.catch &&
            x.constructor.prototype.then);
};

/**
* Derive an explanation from a function's name.
* @param {String} name
* @return {String}
*/
var getExplanation = function (name) {
    var regex = /([a-z]+|[A-Z]|[0-9]+)/g;
    var words = [];
    var result = regex.exec(name);

    while (result !== null) {
        if (result.index) {
            words.push(name.substr(0, result.index).toLowerCase());
            name = name.substr(result.index);
        }
        
        result = regex.exec(name);
    }

    if (!words.length) {
        words = [name];
    }

    return words.join(' ');
};

/**
* Add a new test to the Question prototype.
* @param {Function} a named function
* @deprecated use #test instead
*/
var addTest = function (fn) {
    Question.prototype[fn.name] = fn;
};

/**
* Add a new test to the Question prototype.
* @param {Function} fn a named function
* @param {String} [explanation] what you were expecting to be true
* If omitted, it will be constructed from the name of fn.
* @param {String} [fnName] Use when you want to use a reserved word
* for your test's name.
*/
var writeTest = function (fn, explanation, fnName) {

    explanation = explanation || getExplanation(fn.name);
    fnName = fnName || fn.name;

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

exports.will = will;
exports.addTest = addTest;
exports.writeTest = writeTest;


// ================================================



/**
* Tests to see if criteria are all in item.
* @param {*} criteria
* @throws {Error}
*/
writeTest(function have() {
    if (!(this.expected instanceof Array)) {
        this.expected = [this.expected];
    }
    return allPropertiesExist(this.expected, this.actual);
}, E.NOT_IN_ARR);


/**
* Check for existence of only specified items.
* @param {*} criteria
*/
writeTest(function haveOnly() {
    if (!(this.expected instanceof Array)) {
        this.expected = [this.expected];
    }
    return onlyThesePropsExist(this.expected, this.actual);
}, E.ARR_HAS_EXTRA);

/**
* Check for existence of any properties in item.
* @param {String/String[]} props
*/
writeTest(function haveAny() {
    if (!(this.expected instanceof Array)) {
        this.expected = [this.expected];
    }

    return anyPropExists(this.expected, this.actual);
}, E.HAVE_ANY_ARR);

/**
* Checks for own properties.
* @param {String} property
*/
writeTest(function haveOwn() {
    return this.actual.hasOwnProperty(this.expected);
}, E.HAVE_OWN);

/**
* Tests a value against a Regular Expression.
* @param {RegExp} regex
*/
writeTest(function match() {
    return this.expected.test(this.actual);
});

/**
* Tests to see if a value is defined.
*/
writeTest(function beDefined() {
    return this.actual !== undefined;
});

/**
* Tests to see if a value is undefined.
*/
writeTest(function beUndefined() {
    return this.actual === undefined;
});

/**
* Tests to see if a value is null.
*/
writeTest(function beNull() {
    return this.actual === null;
});

/**
* Tests to see if a value is truthy.
*/
writeTest(function beTruthy() {
    return !!this.actual;
});

/**
* Tests to see if a value is falsy.
*/
writeTest(function beFalsy() {
    return !this.actual;
});

/**
* Tests to see if a value is less than another.
*/
writeTest(function beLessThan() {
    return this.actual < this.expected;
});

/**
* Tests to see if a value is greater than another.
*/
writeTest(function beGreaterThan() {
    return this.actual > this.expected;
});

/**
* Throws error based on identity comparison.
* @param {*} criterion
* @return {Promise}
*/
writeTest(function be() {
    return this.actual === this.expected;
}, E.STRICT_EQ);

/**
* Throws error based on equality comparison.
* @param {*} criterion
*/
writeTest(function beLike() {
    return this.actual == this.expected;
}, E.EQ);

/**
* Throw if the item in Question does not throw.
*/
writeTest(function () {
    return mayThrow(this.actual);
}, null, 'throw');

/**
* Tests inheritance
* @param {Function} criterion
*/
writeTest(function beA() {
    return this.actual instanceof this.expected;
}, E.INST);

writeTest(function beAn() {
    return this.actual instanceof this.expected;
}, E.INST);

/**
* Tests for an undefined item.
*/
writeTest(function exist() {
    return this.actual !== undefined;
}, E.UNDEF);