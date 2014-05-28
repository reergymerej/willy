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
    OBJ_HAS_EXTRA: 'have only these properties:'
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

    // There are different rules for Arrays and Objects.
    var isArray = this.item instanceof Array;

    criteria = (criteria instanceof Array) ?
        criteria : [criteria];

    if (this.isFalse(allPropertiesExist(criteria, this.item))) {
        if (isArray) {
            this.raise(E.NOT_IN_ARR, criteria);
        } else {
            this.raise(E.NOT_IN_OBJ, criteria);
        }
    }
};

/**
* Check for existence of only specified items.
* @param {*} criteria
*/
Question.prototype.haveOnly = function (criteria) {
    
    var isArray = this.item instanceof Array;
    
    criteria = (criteria instanceof Array) ?
        criteria : [criteria];

    if (this.isFalse(onlyThesePropsExist(criteria, this.item))) {
        if (isArray) {
            this.raise(E.ARR_HAS_EXTRA, criteria);
        } else {
            this.raise(E.OBJ_HAS_EXTRA, criteria);
        }
    }
};

/**
* Check for existence of any properties in item.
* @param {String/String[]} props
*/
Question.prototype.haveAny = function (props) {
    var isArray = this.item instanceof Array;
    props = props instanceof Array ? props : [props];

    if (this.isFalse(anyPropExists(props, this.item))) {
        this.raise(E[isArray ? 'HAVE_ANY_ARR' : 'HAVE_ANY_OBJ'], props);
    }
};

/**
* Checks for own properties.
* @param {String} property
*/
Question.prototype.haveOwn = function (property) {
    if (this.isFalse(this.item.hasOwnProperty(property))) {
        this.raise(E.HAVE_OWN, property);
    }
};

/**
* Throws error based on identity comparison.
* @param {*} criterion
* @return {Promise}
*/
Question.prototype.be = function (criterion) {
    var that = this;

    if (this.eventual) {
        return Q.Promise(function (resolve, reject, notify) {
            if (that.isTrue(that.item === criterion)) {
                resolve();
            } else {
                reject(that.getError(E.STRICT_EQ, criterion));
            }
        });
    } else {
        if (this.isFalse(this.item === criterion)) {
            this.raise(E.STRICT_EQ, criterion);
        }
    }
};

/**
* Throws error based on equality comparison.
* @param {*} criterion
*/
Question.prototype.beLike = function (criterion) {
    if (this.isFalse(this.item == criterion)) {
        this.raise(E.EQ, criterion);
    }
};

/**
* Throw if the item in Question does not throw.
*/
Question.prototype.throw = function () {
    if (this.isFalse(mayThrow(this.item))) {
        this.raise(E.THROW);
    }
};

/**
* Tests inheritance
* @param {Function} criterion
*/
Question.prototype.beA = 
    Question.prototype.beAn = function (criterion) {

    if (this.isFalse(this.item instanceof criterion)) {
        this.raise(E.INST, criterion.name);
    }
};

/**
* Tests for an undefined item.
*/
Question.prototype.exist = function () {
    if (this.isTrue(this.item === undefined)) {
        this.raise(E.UNDEF);
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

Question.prototype.isFalse = function (expression) {
    return !this.isTrue(expression);
};

/**
* Raise an error, inserting the item in question and correct
* "truth" based on if Question has been negated.
* @param {String} comparison text version of comparison
* @param {*} values values item was tested against
*/
Question.prototype.raise = function (comparison, values) {
    throw this.getError(comparison, values);
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
* @param {Array} interrogated
* @return {Question}
*/
var will = function (interrogated) {
    return new Question(interrogated);
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