'use strict';

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
    if (this.item.indexOf(criterion) === -1) {
        throw new Error('not in array');
    }
};

/**
* Throws error based on identity comparison.
* @param {*} criterion
*/
Question.prototype.be = function (criterion) {
    if (this.item !== criterion) {
        throw new Error('not equal');
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


