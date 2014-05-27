'use strict';

var E = {
    UNDEF: 'exist',
    INST: 'be an instance of',
    NO_THROW: 'did not throw error',
    NOT_IN_ARR: 'have all of these:',
    EQ: 'be like',
    STRICT_EQ: 'strictly equal',
    NOT_IN_OBJ: 'property not in object',
    HAS_OWN: 'does not have own property',
    ARR_HAS_EXTRA: 'has more items than expected',
    OBJ_HAS_EXTRA: 'has more properties than expected'
};

var err = function (msg) {
    throw new Error(msg);
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
*/
var Question = function (item, negative) {
    this.item = item;
    this.negative = !!negative;
    if (!this.negative) {
        this.not = new Question(item, true);
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
            err(E.NOT_IN_OBJ);
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
            err(E.ARR_HAS_EXTRA);
        } else {
            err(E.OBJ_HAS_EXTRA);
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
        err(E[isArray ? 'NOT_IN_ARR' : 'NOT_IN_OBJ']);
    }
};

/**
* Checks for own properties.
* @param {String} property
*/
Question.prototype.haveOwn = function (property) {
    if (this.isFalse(this.item.hasOwnProperty(property))) {
        err(E.HAS_OWN);
    }
};

/**
* Throws error based on identity comparison.
* @param {*} criterion
*/
Question.prototype.be = function (criterion) {
    if (this.isFalse(this.item === criterion)) {
        this.raise(E.STRICT_EQ, criterion);
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
    var threw = mayThrow(this.item);
    if (!this.isTrue(threw)) {
        err(E.NO_THROW);
    }
};

/**
* Tests inheritance
* @param {Function} criterion
*/
Question.prototype.beA = 
    Question.prototype.beAn = function (criterion) {

    if (!this.isTrue(this.item instanceof criterion)) {
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
    var msg = 'expected <' + this.item + '>' +
        (this.negative ? ' not' : '') + ' to ' +
        comparison;

    if (values !== undefined) {
        msg += ' <' + values + '>';
    }

    throw new Error(msg);
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
