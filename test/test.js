var crybaby = require('../index'),
    will = crybaby.will;

var E = {
    UNDEF: 'not defined',
    INST: 'not instanceof',
    NO_THROW: 'did not throw error'
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

describe('will', function () {
    it('should return an Object', function () {
        if (!(will() instanceof Object)) {
            err(E.INST);
        }
    });
});

describe('have', function () {
    describe('Arrays', function () {
        it('should not throw if the tested item is found', function () {
            will([1, 2, 3]).have(1);
        });

        it('should throw if the tested item is not found', function () {
            var threw = mayThrow(function () {
                will([1, 2, 3]).have(5);
            });

            if (!threw) {
                err(E.NO_THROW);
            }
        });
    });
});

describe('be', function () {
    it('should not throw if passes identity comparison', function () {
        will(3).be(3);
    });

    it('should throw if fails identity comparison', function () {
        var threw = mayThrow(function () {
            will(3).be(4);
        });
        
        if (!threw) {
            err(E.NO_THROW);
        }
    });
});