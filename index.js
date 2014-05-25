'use strict';

var E = {
    UNDEF: 'not defined',
    INST: 'not instanceof',
    NO_THROW: 'did not throw error',
    NOT_IN_ARR: 'not in Array',
    NOT_EQL: 'not equal',
    NOT_ST_EQL: 'not strictly equal',
    NOT_IN_OBJ: 'member not in object'
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
*/
var Question = function (item) {
    this.item = item;
};

/**
* Throws an error if an item is not in the item in Question.
* @param {*} criterion
* @throws {Error}
*/
Question.prototype.have = function (criterion) {

    // There are different rules for Arrays and Objects.
    var isArray = this.item instanceof Array;

    if (isArray) {
        if (this.item.indexOf(criterion) === -1) {
            err(E.NOT_IN_ARR);
        }
    } else {
        if (this.item[criterion] === undefined) {
            err(E.NOT_IN_OBJ);
        }
    }
};

/**
* Throws error based on identity comparison.
* @param {*} criterion
*/
Question.prototype.be = function (criterion) {
    if (this.item !== criterion) {
        err(E.NOT_ST_EQL);
    }
};

/**
* Throws error based on equality comparison.
* @param {*} criterion
*/
Question.prototype.beLike = function (criterion) {
    if (this.item != criterion) {
        err(E.NOT_EQL);
    }
};

/**
* Throw if the item in Question does not throw.
*/
Question.prototype.throw = function () {
    var threw = mayThrow(this.item);
    if (!threw) {
        err(E.NO_THROW);
    }
};

/**
* Tests inheritance
* @param {Function} criterion
*/
Question.prototype.beA = 
    Question.prototype.beAn = function (criterion) {
    if (!(this.item instanceof criterion)) {
        err(E.INST);
    }
};

/**
* @param {Array} interrogated
* @return {Question}
*/
var will = function (interrogated) {
    return new Question(interrogated);
};

exports.will = will;


