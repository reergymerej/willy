'use strict';

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

/**
* Tests for an undefined item.
*/
exports.exist = {
    fn: function () {
        return this.actual !== undefined;    
    }
};

/**
* Tests inheritance
* @param {Function} criterion
*/
exports.beA = {
    fn: function () {
        return this.actual instanceof this.expected;
    },
    explanation: E.INST
};

/**
* Tests inheritance
* @param {Function} criterion
*/
exports.beAn = {
    fn: function () {
        return this.actual instanceof this.expected;
    },
    explanation: E.INST
};

/**
* Throw if the item in Question does not throw.
*/
exports.throw = {
    fn: function () {
        return mayThrow(this.actual);
    }
};

/**
* Throws error based on equality comparison.
* @param {*} criterion
*/
exports.beLike = {
    fn: function () {
        return this.actual == this.expected;
    },
    explanation: E.EQ
};

/**
* Throws error based on identity comparison.
* @param {*} criterion
* @return {Promise}
*/
exports.be = {
    fn: function () {
        return this.actual === this.expected;
    },
    explanation: E.STRICT_EQ
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
* Tests to see if a value is falsy.
*/
exports.beFalsy = {
    fn: function () {
        return !this.actual;
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
* Tests to see if a value is null.
*/
exports.beNull = {
    fn: function () {
        return this.actual === null;
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
* Tests to see if a value is defined.
*/
exports.beDefined = {
    fn: function () {
        return this.actual !== undefined;
    }
};

/**
* Tests a value against a Regular Expression.
* @param {RegExp} regex
*/
exports.match = {
    fn: function match() {
        return this.expected.test(this.actual);
    }
};

/**
* Checks for own properties.
* @param {String} property
*/
exports.haveOwn = {
    fn: function () {
        return this.actual.hasOwnProperty(this.expected);
    },
    explanation: E.HAVE_OWN
};

/**
* Check for existence of any properties in item.
* @param {String/String[]} props
*/
exports.haveAny = {
    fn: function haveAny() {
        if (!(this.expected instanceof Array)) {
            this.expected = [this.expected];
        }

        return anyPropExists(this.expected, this.actual);
    },
    explanation: E.HAVE_ANY_ARR
};

/**
* Check for existence of only specified items.
* @param {*} criteria
*/
exports.haveOnly = {
    fn: function haveOnly() {
        if (!(this.expected instanceof Array)) {
            this.expected = [this.expected];
        }
        return onlyThesePropsExist(this.expected, this.actual);
    },
    explanation: E.ARR_HAS_EXTRA
};

/**
* Tests to see if criteria are all in item.
* @param {*} criteria
* @throws {Error}
*/
exports.have = {
    fn: function have() {
        if (!(this.expected instanceof Array)) {
            this.expected = [this.expected];
        }
        return allPropertiesExist(this.expected, this.actual);
    }, 
    explanation: E.NOT_IN_ARR
};