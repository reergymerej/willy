var crybaby = require('../index'),
    should = crybaby.should;

describe('#should', function () {
    it('should exist', function () {
        if (should === undefined) {
            throw new Error('not defined');
        }
    });
});