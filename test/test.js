var crybaby = require('../index'),
    will = crybaby.will;

describe('#will', function () {
    it('should exist', function () {
        if (will === undefined) {
            throw new Error('not defined');
        }
    });
});