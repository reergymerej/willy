'use strict';

var Q = require('q');
var path = require('path');
var fs = require('fs');

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

var loadTests = function () {
    var pathname = path.join(__dirname, 'willy-tests.js');
    var willyTests = require('./willy-tests.js');
    Object.keys(willyTests).forEach(function (test) {
        var definition = willyTests[test];

        defineTest(
            definition.fn,
            definition.explanation,
            definition.name || definition.fn.name || test
        );
    });

    console.log('tests loaded');
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
    console.warn('Don\'t use addTest.  Use defineTest instead.');
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
var defineTest = function (fn, explanation, fnName) {

    fnName = fnName || fn.name;
    explanation = explanation || getExplanation(fnName);

    if (!fnName) {
        console.error(fn.toString());
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

loadTests();


exports.will = will;
exports.addTest = addTest;
exports.defineTest = defineTest;
