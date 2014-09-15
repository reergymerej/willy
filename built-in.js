'use strict';

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

var isPOJO = function (item) {
    return Object.prototype.toString.call(item) === '[object Object]';
};

/**
* return `true` if `item` is an Object (POJO) or Array
*/
var isIterable = function (item) {
    return Array.isArray(item) || isPOJO(item);
};

/**
* Test equality.
* @return {Boolean}
*/
var areEqual = function (a, b) {
    var expression;

    if (isIterable(a)) {
        expression = objectsMatch(a, b);
    } else {
        expression = a == b;
    }

    return expression;
};

/**
* Compares two objects.  Returns true if both have the same
* properties with the same equality.
*/
var objectsMatch = function (a, b) {
    var isMatch = false;
    var aKeys = Object.keys(a);
    var bKeys = Object.keys(b);
    
    if (isIterable(a) && isIterable(b)) {
        if (aKeys.length === bKeys.length) {
            isMatch = true;

            aKeys.forEach(function (key) {
                if (isMatch) {
                    if (isIterable(a[key]) ||
                        isIterable(b[key])) {
                            isMatch = areEqual(a[key], b[key]);
                    } else {
                        isMatch = a[key] == b[key];
                    }
                }
            }, this);
        }
    }

    return isMatch;
};

/**
* Throws error based on identity comparison.
* @param {*} criterion
* @return {Promise}
*/
exports.be = {
    fn: function () {
        return this.actual === this.expected;
    }
};

/**
* Tests inheritance
* @param {Function} criterion
*/
exports.beA = {
    fn: testInstanceOf
};

/**
* Tests inheritance
* @param {Function} criterion
*/
exports.beAn = {
    fn: testInstanceOf
};

/**
* Tests to see if a value is defined.
*/
exports.beDefined = {
    fn: function () {
        return this.actual !== undefined;
    }
};

/**
* Tests to see if a value is falsy.
*/
exports.beFalsy = {
    fn: function () {
        return !this.actual;
    }
};

/**
* Tests to see if a value is greater than another.
*/
exports.beGreaterThan = {
    fn: function () {
        return this.actual > this.expected;
    }
};

/**
* Tests to see if a value is less than another.
*/
exports.beLessThan = {
    fn: function () {
        return this.actual < this.expected;
    }
};

/**
* Throws error based on equality comparison.
* @param {*} criterion
*/
exports.beLike = {
    fn: function () {
        return areEqual(this.actual, this.expected);
    }
};

/**
* Tests to see if a value is greater than another.
*/
exports.beMoreThan = {
    fn: function () {
        return this.actual > this.expected;
    }
};

/**
* Tests to see if a value is null.
*/
exports.beNull = {
    fn: function () {
        return this.actual === null;
    }
};

/**
* Tests to see if a value is truthy.
*/
exports.beTruthy = {
    fn: function () {
        return !!this.actual;
    }
};

/**
* Tests to see if a value is undefined.
*/
exports.beUndefined = {
    fn: function () {
        return this.actual === undefined;
    }
};

/**
* Tests for an undefined item.
*/
exports.exist = {
    fn: function () {
        return this.actual !== undefined;    
    }
};

/**
* Tests to see if criteria are all in item.
* @param {*} criteria
* @throws {Error}
*/
exports.have = {
    fn: function () {
        if (!(this.expected instanceof Array)) {
            this.expected = [this.expected];
        }
        return allPropertiesExist(this.expected, this.actual);
    }, 
    explanation: 'have all of these items:'
};

/**
* Check for existence of any properties in item.
* @param {String/String[]} props
*/
exports.haveAny = {
    fn: function () {
        if (!(this.expected instanceof Array)) {
            this.expected = [this.expected];
        }

        return anyPropExists(this.expected, this.actual);
    },
    explanation: 'have any of these items:'
};

/**
* Check for existence of only specified items.
* @param {*} criteria
*/
exports.haveOnly = {
    fn: function () {
        if (!(this.expected instanceof Array)) {
            this.expected = [this.expected];
        }
        return onlyThesePropsExist(this.expected, this.actual);
    },
    explanation: 'have only these items:'
};

/**
* Checks for own properties.
* @param {String} property
*/
exports.haveOwn = {
    fn: function () {
        return this.actual.hasOwnProperty(this.expected);
    }
};

/**
* Tests a value against a Regular Expression.
* @param {RegExp} regex
*/
exports.match = {
    fn: function () {
        return this.expected.test(this.actual);
    }
};

/**
* Throw if the item in Question does not throw.
*/
exports.throw = {
    fn: function () {
        return mayThrow(this.actual);
    }
};
