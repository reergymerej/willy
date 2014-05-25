'use strict';

var E = {
    UNDEF: 'not defined',
    INST: 'not instanceof',
    NO_THROW: 'did not throw error',
    NOT_IN_ARR: 'not in Array',
    NOT_EQL: 'not equal',
    NOT_ST_EQL: 'not strictly equal',
    NOT_IN_OBJ: 'member not in object',
    HAS_OWN: 'does not have own property',
    ARR_HAS_EXTRA: 'has more properties than expected',
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
* Throws an error if an item is not in the item in Question.
* @param {*} criterion
* @throws {Error}
*/
Question.prototype.have = function (criterion) {

    var criteria = (criterion instanceof Array) ?
        criterion : [criterion];

    // There are different rules for Arrays and Objects.
    var isArray = this.item instanceof Array;

    var i, max;

    for (i = 0, max = criteria.length; i < max; i++) {
        
        if (isArray) {

            console.log(this.isTrue(this.item.indexOf(criteria[i]) === -1));

            if (this.isTrue(this.item.indexOf(criteria[i]) === -1)) {
                err(E.NOT_IN_ARR);
            }
        } else {
            if (this.item[criteria[i]] === undefined) {
                err(E.NOT_IN_OBJ);
            }
        }
    }
};

/**
* Check for existence of only specified items.
* @param {*} criterion
*/
Question.prototype.haveOnly = function (criterion) {
    var criteria = (criterion instanceof Array) ?
        criterion : [criterion];

    // There are different rules for Arrays and Objects.
    var isArray = this.item instanceof Array;

    var i, max;

    if (isArray) {
        for (i = 0, max = this.item.length; i < max; i++) {
            if (criteria.indexOf(this.item[i]) === -1) {
                err(E.ARR_HAS_EXTRA);
            }
        }
    } else {
        for (i in this.item) {
            if (this.item.hasOwnProperty(i)) {
                if (criteria.indexOf(i) === -1) {
                    err(E.OBJ_HAS_EXTRA);
                }
            }
        }
    }
};

/**
* Checks for own properties.
* @param {String} property
*/
Question.prototype.haveOwn = function (property) {
    if (!this.item.hasOwnProperty(property)) {
        err(E.HAS_OWN);
    }
};

/**
* Throws error based on identity comparison.
* @param {*} criterion
*/
Question.prototype.be = function (criterion) {
    if (this.isFalse(this.item === criterion)) {
        err(E.NOT_ST_EQL);
    }
};

/**
* Throws error based on equality comparison.
* @param {*} criterion
*/
Question.prototype.beLike = function (criterion) {
    if (!this.isTrue(this.item == criterion)) {
        err(E.NOT_EQL);
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
        err(E.INST);
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
* @param {Array} interrogated
* @return {Question}
*/
var will = function (interrogated) {
    return new Question(interrogated);
};

exports.will = will;


