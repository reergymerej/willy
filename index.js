'use strict';

var Q = require('q');
var util = require('util');

var loadBuiltinTests = function () {
    loadDefinitions(require('./willy-tests.js'));
};

/**
* @param {Object}
*/
var loadDefinitions = function (tests) {
    Object.keys(tests).forEach(function (test) {
        var definition = tests[test];
        definition.name = definition.name || definition.fn.name  || test;
        define(definition);
    });
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
    var msg = 'expected ' + util.inspect(this.actual);

    if (this.negative) {
        msg += ' not';
    }

    msg += ' to ' + this.explanation;

    if (this.hasExpected) {
        msg += ' ' + util.inspect(this.expected);
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
    var regex = /([A-Z]|[0-9]+)/g;
    var indices = [0];
    var words = [];
    var result = regex.exec(name);
    var index;

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
* @param {Function} a named function
* @deprecated use #test instead
*/
var addTest = function (fn) {
    console.warn('Don\'t use addTest.  Use define instead.');
    Question.prototype[fn.name] = fn;
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
var define = function (fn, explanation, fnName) {

    // Handle alternate signature.
    if (typeof fn === 'object') {
        fnName = fn.name;
        explanation = fn.explanation;
        fn = fn.fn;
    }

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

loadBuiltinTests();

exports.will = will;
exports.addTest = addTest;
exports.define = define;
exports.loadDefinitions = loadDefinitions;
