var crybaby = require('../index'),
    will = crybaby.will;

var E = {
    UNDEF: 'not defined',
    INST: 'not instanceof',
    NO_THROW: 'did not throw error',
    THROW: 'unexpected error'
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

describe('be', function () {
    it('should not throw if passes identity comparison', function () {
        var threw = mayThrow(function () {
            will(3).be(3);
        });

        if (threw) {
            err(E.THROW);
        }
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

describe('beLike', function () {
    it('should not throw if passes equality comparison', function () {
        var threw = mayThrow(function () {
            will('').beLike(false);
        });

        if (threw) {
            err(E.THROW);
        }
    });

    it('should throw if fails equality comparison', function () {
        var threw = mayThrow(function () {
            will('').beLike(true);
        });

        if (!threw) {
            err(E.NO_THROW);
        }
    });
});

describe('beA/beAn', function () {
    it('should be the same as beAn', function () {
        var question = will();
        will(question.beA).be(question.beAn);
    });

    it('should not throw if is an instanceof', function () {
        var threw = mayThrow(function () {
            will([]).beAn(Array);
        });

        if (threw) {
            err(E.THROW);
        }
    });
    
    it('should throw if item is not an instanceof', function () {
        var threw = mayThrow(function () {
            will([]).beA(String);
        });

        if (!threw) {
            err(E.NO_THROW);
        }
    });
});

describe('throw', function () {
    it('should not throw if the fn throws', function () {
        var threw = mayThrow(function () {
            will(function () {
                throw new Error('whoops');
            }).throw();
        });

        if (threw) {
            err(E.THROW);
        }
    });

    it('should throw if the fn does not throw', function () {
        var threw = mayThrow(function () {
            will(function () {}).throw();
        });

        if (!threw) {
            err(E.NO_THROW);
        }
    });
});

describe('have', function () {
    describe('Arrays', function () {
        it('should not throw if the tested item is found', function () {

            var threw = mayThrow(function () {
                will([1, 2, 3]).have(1);
            });

            if (threw) {
                err(E.THROW);
            }
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

    describe('Objects', function () {
        it('should not throw if tested item has member', function () {
            var threw = mayThrow(function () {
                will({foo: true}).have('foo');
            });

            if (threw) {
                err(E.THROW);
            }
        });

        it('should throw if tested item does not have member', function () {
            var threw = mayThrow(function () {
                will({foo: true}).have('bar');
            });

            if (!threw) {
                err(E.NO_THROW);
            }
        });
    });
});

describe('haveOwn', function () {
    var Foo = function () {};
    Foo.prototype.bar = true;

    var foo;

    beforeEach(function () {
        foo = new Foo();
        foo.baz = true;
    });

    afterEach(function () {
        foo = undefined;
    });

    it('should not throw if tested item has its own member', function () {
        var threw = mayThrow(function () {
            will(foo).haveOwn('baz');
        });

        if (threw) {
            err(E.NO_THROW);
        }
    });

    it('should throw if tested item does not have its own member', function () {
        var threw = mayThrow(function () {
            will(foo).haveOwn('bar');
        });

        if (!threw) {
            err(E.NO_THROW);
        }
    });
});