var Q = require('q');
var willy = require('../index'),
    will = willy.will;

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

var ThrowAttempt = function (fn) {
    this.threw = false;
    try {
        fn();
    } catch (e) {
        this.error = e;
        this.threw = true;
    }
};

// get a basic promise that will return val
var p = function (val) {
    return Q.fcall(function () { return val; });
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

describe('exist', function () {
    var foo = { bar: 1 };

    it('should not throw if item is defined', function () {
        var threw = mayThrow(function () {
            will(foo.bar).exist();
        });

        if (threw) {
            err(E.THROW);
        }
    });

    it('should throw if item is undefined', function () {
        var threw = mayThrow(function () {
            will(foo.baz).exist();
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
    describe('when checking an Array', function () {
        describe('checking for a single item', function () {
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

        describe('checking for multiple items', function () {
            it('should not throw if it has all items', function () {

                var threw = mayThrow(function () {
                    will([1, 2, 3]).have([1, 3]);
                });

                if (threw) {
                    err(E.THROW);
                }
            });

            it('should throw if it does not have all items', function () {

                var threw = mayThrow(function () {
                    will([1, 2, 3]).have([1, 2, 3, 4]);
                });

                if (!threw) {
                    err(E.NO_THROW);
                }
            });
        });
    });

    describe('when checking an Object', function () {
        describe('checking for single items', function () {
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

        describe('checking for multiple items', function () {
            it('should not throw if it has all members', function () {
                var threw = mayThrow(function () {
                    will({
                        foo: true,
                        bar: true
                    }).have(['foo', 'bar']);
                });

                if (threw) {
                    err(E.THROW);
                } 
            });

            it('should throw if it does not have all members', function () {
                var threw = mayThrow(function () {
                    will({
                        foo: true,
                        bar: true
                    }).have(['foo', 'bar', 'baz']);
                });

                if (!threw) {
                    err(E.NO_THROW);
                } 
            });
        });
    });
});

describe('haveOnly', function () {
    describe('when checking an Array', function () {
        it('should not throw if only has specified items', function () {
            var threw = mayThrow(function () {
                will([1, 2, 3]).haveOnly([1, 2, 3]);
            });

            if (threw) {
                err(E.THROW);
            }
        });

        it('should also work when specifying a single item', function () {
            var threw = mayThrow(function () {
                will([3]).haveOnly(3);
            });

            if (threw) {
                err(E.THROW);
            }
        });

        it('should throw when more than specified are present', function () {
            var threw = mayThrow(function () {
                will([1, 2, 3]).haveOnly([1, 2]);
            });

            if (!threw) {
                err(E.NO_THROW);
            }
        });
    });

    describe('when checking an Object', function () {
        it('should not throw if only has specified items', function () {
            var threw = mayThrow(function () {
                will({ foo: 1, bar: 1 }).haveOnly(['foo', 'bar']);
            });

            if (threw) {
                err(E.THROW);
            }
        });

        it('should also work when specifying a single item', function () {
            var threw = mayThrow(function () {
                will({ foo: 1 }).haveOnly('foo');
            });

            if (threw) {
                err(E.THROW);
            }
        });

        it('should throw if has more than specified items', function () {
            var threw = mayThrow(function () {
                will({
                    foo: 1,
                    bar: 1,
                    baz: 1
                }).haveOnly(['foo', 'bar']);
            });

            if (!threw) {
                err(E.NO_THROW);
            }
        });
    });
});

describe('haveAny', function () {
    describe('when checking an Array', function () {
        it('should not throw if one of the props is found', function () {
            var threw = mayThrow(function () {
                will([1, 2, 3]).haveAny([9, 8, 2]);
            });

            if (threw) {
                err(E.THROW);
            }
        });

        it('should throw if none of the props is found', function () {
            var threw = mayThrow(function () {
                will([1, 2, 3]).haveAny([9, 8]);
            });

            if (!threw) {
                err(E.NO_THROW);
            }
        });
    });

    describe('when checking an Object', function () {
        it('should not throw if one of the props is found', function () {
            var threw = mayThrow(function () {
                will({ foo: 1 }).haveAny(['foo', 'bar', 'baz']);
            });

            if (threw) {
                err(E.THROW);
            }
        });

        it('should throw if one of the props is found', function () {
            var threw = mayThrow(function () {
                will({ foo: 1 }).haveAny(['bar', 'baz']);
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

describe('match', function () {
    var foo;
    
    beforeEach(function () {
        foo = 'asdf';
    });

    afterEach(function () {
        foo = undefined;
    });

    it('should not throw if tested item matches regex', function () {
        var threw = mayThrow(function () {
            will(foo).match(/SD/i);
        });

        if (threw) {
            err(E.NO_THROW);
        }
    });

    it('should throw if tested item does not match regex', function () {
        var threw = mayThrow(function () {
            will(foo).match(/SD/);
        });

        if (!threw) {
            err(E.NO_THROW);
        }
    });

    describe('inverted', function () {
        it('should throw if tested item matches regex', function () {
            var threw = mayThrow(function () {
                will(foo).not.match(/SD/i);
            });

            if (!threw) {
                err(E.NO_THROW);
            }
        });

        it('should not throw if tested item does not match regex', function () {
            var threw = mayThrow(function () {
                will(foo).not.match(/SD/);
            });

            if (threw) {
                err(E.NO_THROW);
            }
        });
    });
});

describe('beDefined', function () {
    it('should not throw if tested item is defined', function () {
        var foo = 123;
        var threw = mayThrow(function () {
            will(foo).beDefined();
        });

        if (threw) {
            err(E.NO_THROW);
        }
    });

    it('should throw if tested item is undefined', function () {
        var foo;
        var threw = mayThrow(function () {
            will(foo).beDefined();
        });

        if (!threw) {
            err(E.NO_THROW);
        }
    });

    describe('inverted', function () {
        it('should throw if tested item is defined', function () {
            var foo = 123;
            var threw = mayThrow(function () {
                will(foo).not.beDefined();
            });

            if (!threw) {
                err(E.NO_THROW);
            }
        });

        it('should not throw if tested item is undefined', function () {
            var foo;
            var threw = mayThrow(function () {
                will(foo).not.beDefined();
            });

            if (threw) {
                err(E.NO_THROW);
            }
        });
    });
});

describe('beUndefined', function () {
    it('should not throw if tested item is undefined', function () {
        var foo;
        var threw = mayThrow(function () {
            will(foo).beUndefined();
        });

        if (threw) {
            err(E.NO_THROW);
        }
    });

    it('should throw if tested item is not undefined', function () {
        var foo = 123;
        var threw = mayThrow(function () {
            will(foo).beUndefined();
        });

        if (!threw) {
            err(E.NO_THROW);
        }
    });

    describe('inverted', function () {
        it('should throw if tested item is undefined', function () {
            var foo;
            var threw = mayThrow(function () {
                will(foo).not.beUndefined();
            });

            if (!threw) {
                err(E.NO_THROW);
            }
        });

        it('should not throw if tested item is defined', function () {
            var foo = 123;
            var threw = mayThrow(function () {
                will(foo).not.beUndefined();
            });

            if (threw) {
                err(E.NO_THROW);
            }
        });        
    });
});

describe('beNull', function () {
    it('should not throw if tested item is null', function () {
        var threw = mayThrow(function () {
            will(null).beNull();
        });

        if (threw) {
            err(E.NO_THROW);
        }
    });

    it('should throw if tested item is not null', function () {
        var threw = mayThrow(function () {
            will(undefined).beNull();
        });

        if (!threw) {
            err(E.NO_THROW);
        }
    });

    describe('inverted', function () {
        it('should throw if tested item is null', function () {
            var threw = mayThrow(function () {
                will(null).not.beNull();
            });

            if (!threw) {
                err(E.NO_THROW);
            }
        });

        it('should not throw if tested item is not null', function () {
            var threw = mayThrow(function () {
                will(undefined).not.beNull();
            });

            if (threw) {
                err(E.NO_THROW);
            }
        });
    });
});

describe('not', function () {
    describe('be', function () {
        it('should throw if passes identity comparison', function () {
            var threw = mayThrow(function () {
                will(3).not.be(3);
            });

            if (!threw) {
                err(E.NO_THROW);
            }
        });

        it('should not throw if fails identity comparison', function () {
            var threw = mayThrow(function () {
                will(3).not.be(4);
            });
            
            if (threw) {
                err(E.THROW);
            }
        });
    });

    describe('beLike', function () {
        it('should throw if passes equality comparison', function () {
            var threw = mayThrow(function () {
                will('').not.beLike(false);
            });

            if (!threw) {
                err(E.NO_THROW);
            }
        });

        it('should not throw if fails equality comparison', function () {
            var threw = mayThrow(function () {
                will('').not.beLike(true);
            });

            if (threw) {
                err(E.THROW);
            }
        });
    });

    describe('beA/beAn', function () {
        it('should throw if is an instanceof', function () {
            var threw = mayThrow(function () {
                will([]).not.beAn(Array);
            });

            if (!threw) {
                err(E.NO_THROW);
            }
        });
        
        it('should not throw if item is not an instanceof', function () {
            var threw = mayThrow(function () {
                will([]).not.beA(String);
            });

            if (threw) {
                err(E.THROW);
            }
        });
    });

    describe('exist', function () {
        var foo = { bar: 1 };

        it('should throw if item is defined', function () {
            var threw = mayThrow(function () {
                will(foo.bar).not.exist();
            });

            if (!threw) {
                err(E.NO_THROW);
            }
        });

        it('should not throw if item is undefined', function () {
            var threw = mayThrow(function () {
                will(foo.baz).not.exist();
            });
            
            if (threw) {
                err(E.THROW);
            }
        });
    });

    describe('throw', function () {
        it('should throw if the fn throws', function () {
            var threw = mayThrow(function () {
                will(function () {
                    throw new Error('whoops');
                }).not.throw();
            });

            if (!threw) {
                err(E.NO_THROW);
            }
        });

        it('should not throw if the fn does not throw', function () {
            var threw = mayThrow(function () {
                will(function () {}).not.throw();
            });

            if (threw) {
                err(E.THROW);
            }
        });
    });

    describe('have', function () {
        describe('when checking an Array', function () {
            describe('checking for a single item', function () {
                it('should throw if the tested item is found', function () {

                    var threw = mayThrow(function () {
                        will([1, 2, 3]).not.have(1);
                    });

                    if (!threw) {
                        err(E.NO_THROW);
                    }
                });

                it('should not throw if the tested item is not found', function () {
                    var threw = mayThrow(function () {
                        will([1, 2, 3]).not.have(5);
                    });

                    if (threw) {
                        err(E.THROW);
                    }
                });
            });

            describe('checking for multiple items', function () {
                it('should throw if it has all items', function () {

                    var threw = mayThrow(function () {
                        will([1, 2, 3]).not.have([1, 3]);
                    });

                    if (!threw) {
                        err(E.NO_THROW);
                    }
                });

                it('should not throw if it does not have all items', function () {

                    var threw = mayThrow(function () {
                        will([1, 2, 3]).not.have([1, 2, 3, 4]);
                    });

                    if (threw) {
                        err(E.THROW);
                    }
                });
            });
        });
        
        describe('when checking an Object', function () {
            describe('checking for single items', function () {
                it('should throw if tested item has member', function () {
                    var threw = mayThrow(function () {
                        will({foo: true}).not.have('foo');
                    });

                    if (!threw) {
                        err(E.NO_THROW);
                    }
                });

                it('should not throw if tested item does not have member', function () {
                    var threw = mayThrow(function () {
                        will({foo: true}).not.have('bar');
                    });

                    if (threw) {
                        err(E.THROW);
                    }
                });
            });

            describe('checking for multiple items', function () {
                it('should throw if it has all members', function () {
                    var threw = mayThrow(function () {
                        will({
                            foo: true,
                            bar: true
                        }).not.have(['foo', 'bar']);
                    });

                    if (!threw) {
                        err(E.NO_THROW);
                    } 
                });

                it('should not throw if it does not have all members', function () {
                    var threw = mayThrow(function () {
                        will({
                            foo: true,
                            bar: true
                        }).not.have(['foo', 'bar', 'baz']);
                    });

                    if (threw) {
                        err(E.THROW);
                    } 
                });
            });
        });
    });

    describe('haveOnly', function () {
        describe('when checking an Array', function () {
            it('should throw if only has specified items', function () {
                var threw = mayThrow(function () {
                    will([1, 2, 3]).not.haveOnly([1, 2, 3]);
                });

                if (!threw) {
                    err(E.NO_THROW);
                }
            });

            it('should not throw when more than specified are present', function () {
                var threw = mayThrow(function () {
                    will([1, 2, 3]).not.haveOnly([1, 2]);
                });

                if (threw) {
                    err(E.THROW);
                }
            });
        });

        describe('when checking an Object', function () {
            it('should throw if only has specified items', function () {
                var threw = mayThrow(function () {
                    will({ foo: 1, bar: 1 }).not.haveOnly(['foo', 'bar']);
                });

                if (!threw) {
                    err(E.NO_THROW);
                }
            });

            it('should not throw if has more than specified items', function () {
                var threw = mayThrow(function () {
                    will({
                        foo: 1,
                        bar: 1,
                        baz: 1
                    }).not.haveOnly(['foo', 'bar']);
                });

                if (threw) {
                    err(E.THROW);
                }
            });
        });
    });

    describe('haveAny', function () {
        describe('when checking an Array', function () {
            it('should throw if one of the props is found', function () {
                var threw = mayThrow(function () {
                    will([1, 2, 3]).not.haveAny([9, 8, 2]);
                });

                if (!threw) {
                    err(E.NO_THROW);
                }
            });

            it('should not throw if none of the props is found', function () {
                var threw = mayThrow(function () {
                    will([1, 2, 3]).not.haveAny([9, 8]);
                });

                if (threw) {
                    err(E.THROW);
                }
            });
        });

        describe('when checking an Object', function () {
            it('should throw if one of the props is found', function () {
                var threw = mayThrow(function () {
                    will({ foo: 1 }).not.haveAny(['foo', 'bar', 'baz']);
                });

                if (!threw) {
                    err(E.NO_THROW);
                }
            });

            it('should not throw if one of the props is found', function () {
                var threw = mayThrow(function () {
                    will({ foo: 1 }).not.haveAny(['bar', 'baz']);
                });

                if (threw) {
                    err(E.THROW);
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

        it('should throw if tested item has its own member', function () {
            var threw = mayThrow(function () {
                will(foo).not.haveOwn('baz');
            });

            if (!threw) {
                err(E.NO_THROW);
            }
        });

        it('should not throw if tested item does not have its own member', function () {
            var threw = mayThrow(function () {
                will(foo).not.haveOwn('bar');
            });

            if (threw) {
                err(E.NO_THROW);
            }
        });
    });
});

describe('addTest', function () {
    before(function () {
        willy.addTest(function equal99() {
            
            return this.if(function (value) {
                return value === 99;
            }, 'dang', 'foo');
        });
    });

    after(function () {
        delete will().constructor.prototype.equal99;
    });
    
    it('should augment the available tests', function () {
        will(99).equal99();
    });

    it('should look like any other test when throwing', function () {
        var threw = mayThrow(function () {
            will(98).equal99();
        });

        if (!threw) {
            err(E.NO_THROW);
        }
    });

    it('should work with not', function () {
        var threw = mayThrow(function () {
            will(98).not.equal99();
        });

        if (threw) {
            err(E.NO_THROW);
        }
    });

    describe('when the fn has arguments', function () {
        before(function () {
            willy.addTest(function beLessThan(x) {
                return this.if(function (val) {
                    return val < x;
                },'be less than', x);
            });
        });

        after(function () {
            delete will().constructor.prototype.equal99;
        });

        it('should work when not throwing', function () {
            try {
                will(1).beLessThan(2);
            } catch (e) {
                err(E.THROW);
            }
        });

        it('should work when throwing', function () {
            var throwAttempt = new ThrowAttempt(function () {
                will(2).beLessThan(2);
            });

            if (!throwAttempt.error) {
                err(E.NO_THROW);   
            }
        });
    });
});

describe('working with promises', function () {
    it('should work with "not.eventually" for success', function () {
        return will(p(1)).eventually.not.be(2).then(function () {
            }, function (err) {
                err(E.NO_THROW);
            });
    });

    it('should work with "eventually.not" for success', function () {
        return will(p(1)).eventually.not.be(2).then(function () {
            }, function (err) {
                err(E.NO_THROW);
            });
    });

    it('should work with "not.eventually" for errors', function () {
        return will(p(1)).not.eventually.be(1).then(function () {
                e.err(E.NO_THROW);
            }, function (err) {
                // failed like it should have
            });
    });

    it('should work with "eventually.not" for errors', function () {

        return will(p(1)).eventually.not.be(1).then(
            function () {
                err(E.NO_THROW);
            }, function (err) {
                // failed like it should have
            });
    });

    it('should work async', function () {
        var promise = Q.Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(1234);
            }, 10);
        });

        return will(promise).eventually.be(123).then(function () {
            err(E.NO_THROW);
        }, function () {
            // failed like it should have
        });
    });
});