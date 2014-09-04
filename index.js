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
    BE_NULL: 'be null'
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
* Tests to see if criteria are all in item.
* @param {*} criteria
* @throws {Error}
*/
Question.prototype.have = function (criteria) {

    // var isArray = this.item instanceof Array;
    // var message = isArray ? E.NOT_IN_ARR : E.NOT_IN_OBJ;

    criteria = (criteria instanceof Array) ?
        criteria : [criteria];

    return this.if(function (val) {
        return allPropertiesExist(criteria, val);
    }, E.NOT_IN_ARR, criteria);
};

/**
* Check for existence of only specified items.
* @param {*} criteria
*/
Question.prototype.haveOnly = function (criteria) {
    
    // var isArray = this.item instanceof Array;
    // var message = isArray ? E.ARR_HAS_EXTRA : E.OBJ_HAS_EXTRA;

    criteria = (criteria instanceof Array) ?
        criteria : [criteria];

    return this.if(function (val) {
        return onlyThesePropsExist(criteria, val);
    }, E.ARR_HAS_EXTRA, criteria);
};

/**
* Check for existence of any properties in item.
* @param {String/String[]} props
*/
Question.prototype.haveAny = function (props) {
    return this.if(function (val) {
        // var isArray = val instanceof Array;
        // var message = isArray ? E.HAVE_ANY_ARR : E.HAVE_ANY_OBJ;
        
        props = props instanceof Array ? props : [props];

        return anyPropExists(props, val);
    }, E.HAVE_ANY_ARR, props);
};

/**
* Checks for own properties.
* @param {String} property
*/
Question.prototype.haveOwn = function (property) {
    return this.if(function (val) {
        return val.hasOwnProperty(property);
    }, E.HAVE_OWN, property);
};

/**
* Tests a value against a Regular Expression.
* @param {RegExp} regex
*/
Question.prototype.match = function (regex) {
    return this.if(function (val) {
        return regex.test(val);
    }, E.MATCH, regex);
};

/**
* Tests to see if a value is defined.
*/
Question.prototype.beDefined = function () {
    return this.if(function (val) {
        return val !== undefined;
    }, E.BE_DEFINED);
};

/**
* Tests to see if a value is undefined.
*/
Question.prototype.beUndefined = function () {
    return this.if(function (val) {
        return val === undefined;
    }, E.BE_UNDEFINED);
};

/**
* Tests to see if a value is null.
*/
Question.prototype.beNull = function () {
    return this.if(function (val) {
        return val === null;
    }, E.BE_NULL);
};

// The 'toBeTruthy' matcher is for boolean casting testing
// The 'toBeFalsy' matcher is for boolean casting testing
// The 'toContain' matcher is for finding an item in an Array
// The 'toBeLessThan' matcher is for mathematical comparisons
// The 'toBeGreaterThan' matcher is for mathematical comparisons
// The 'toBeCloseTo' matcher is for precision math comparison

/**
* Throws error based on identity comparison.
* @param {*} criterion
* @return {Promise}
*/
Question.prototype.be = function (criterion) {
    return this.if(function (value) {
            return value === criterion;
        }, E.STRICT_EQ, criterion);
};

/**
* Throws error based on equality comparison.
* @param {*} criterion
*/
Question.prototype.beLike = function (criterion) {
    return this.if(function (val) {
        return val == criterion;
    }, E.EQ, criterion);
};

/**
* Throw if the item in Question does not throw.
*/
Question.prototype.throw = function () {
    return this.if(function (val) {
        return mayThrow(val);
    }, E.THROW);
};

/**
* Tests inheritance
* @param {Function} criterion
*/
Question.prototype.beA = 
    Question.prototype.beAn = function (criterion) {
        return this.if(function (val) {
            return val instanceof criterion;
        }, E.INST, criterion.name);
};

/**
* Tests for an undefined item.
*/
Question.prototype.exist = function () {
    return this.if(function (val) {
        return val !== undefined;
    }, E.UNDEF);
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
    var msg = 'expected <' + this.item + '>' +
        (this.negative ? ' not' : '') + ' to ' +
        comparison;

    if (values !== undefined) {
        msg += ' <' + values + '>';
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
*/
Question.prototype.if = function (testCallback, message, criteria) {
    var that = this;

    if (this.eventual) {

        return this.item.then(function (value) {

            if (!that.isTrue(testCallback(value))) {
                throw that.getError(message, criteria);
            }

        }, function (err) {
            console.log('an error', err);
            throw that.getError(message, criteria);
        });
    } else {
        if (!that.isTrue(testCallback(this.item))) {
            throw this.getError(message, criteria);
        }
    }
};

/**
* @param {Array} interrogated
* @return {Question}
*/
var will = function (interrogated) {
    return new Question(interrogated);
};

var isPromise = function (x) {
    return !!(x.constructor.prototype.catch &&
            x.constructor.prototype.then);
};

/**
* Add a new test to the Question prototype.
* @param {Function} a named function
*/
var addTest = function (fn) {
    Question.prototype[fn.name] = fn;
};

exports.will = will;
exports.addTest = addTest;