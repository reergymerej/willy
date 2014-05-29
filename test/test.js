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
            // if (this.isFalse(this.item === 99)) {
            //     this.raise('equal 99');
            // }

            return this.if(this.item !== 99, 'dang');
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
            err(E.THROW);
        }
    });

    describe('when the fn has arguments', function () {
        before(function () {
            willy.addTest(function beLessThan(x) {
                return this.if(this.item >= x,
                    'be less than', x);

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

        describe('raised messages should make sense', function () {
            it('should throw a message that makes sense', function () {
                var throwAttempt = new ThrowAttempt(function () {
                    will(2).beLessThan(2);
                });

                if (throwAttempt.error.message !==
                    'expected <2> to be less than <2>') {
                    err('wrong message');
                }
            });

            it('should throw a message that makes sense when using not', function () {
                var throwAttempt = new ThrowAttempt(function () {
                    will(1).not.beLessThan(2);
                });

                if (throwAttempt.error.message !==
                    'expected <1> not to be less than <2>') {
                    err('wrong message');
                }
            });
        });
    });
});

describe('error messages', function () {
    it('should make sense for be', function () {
        var msg = new ThrowAttempt(function () {
            will(false).be(true);
        }).error.message;

        will(msg).be('expected <false> to strictly equal <true>');
    });

    it('should make sense for not.be', function () {
        var msg = new ThrowAttempt(function () {
            will(false).not.be(false);
        }).error.message;

        will(msg).be('expected <false> not to strictly equal <false>');
    });

    it('should make sense for beA/beAn', function () {
        var msg = new ThrowAttempt(function () {
            will('foo').beAn(Array);
        }).error.message;

        will(msg).be('expected <foo> to be an instance of <Array>');
    });

    it('should make sense for not.beA/beAn', function () {
        var msg = new ThrowAttempt(function () {
            will(['foo']).not.beAn(Array);
        }).error.message;

        will(msg).be('expected <' + ['foo'] + '> not to be an instance of <Array>');
    });

    it('should make sense for beLike', function () {
        var msg = new ThrowAttempt(function () {
            will('').beLike(true);
        }).error.message;

        will(msg).be('expected <> to be like <true>');
    });

    it('should make sense for not.beLike', function () {
        var msg = new ThrowAttempt(function () {
            will('').not.beLike(false);
        }).error.message;

        will(msg).be('expected <> not to be like <false>');
    });

    it('should make sense for exist', function () {
        var msg = new ThrowAttempt(function () {
            var foo = {};
            will(foo.bar).exist();
        }).error.message;

        will(msg).be('expected <undefined> to exist');
    });

    it('should make sense for not.exist', function () {
        var msg = new ThrowAttempt(function () {
            var foo = { bar: 1 };
            will(foo.bar).not.exist();
        }).error.message;

        will(msg).be('expected <1> not to exist');
    });

    it('should make sense for have (Array)', function () {
        var msg = new ThrowAttempt(function () {
            will([1, 2]).have([1, 2, 3]);
        }).error.message;

        will(msg).be('expected <1,2> to have all of these items: <1,2,3>');
    });

    it('should make sense for not.have (Array)', function () {
        var msg = new ThrowAttempt(function () {
            will([1, 2, 3]).not.have([1, 2, 3]);
        }).error.message;

        will(msg).be('expected <1,2,3> not to have all of these items: <1,2,3>');
    });

    it('should make sense for have (Object)', function () {
        var msg = new ThrowAttempt(function () {
            will({ foo: 1 }).have(['foo', 'bar']);
        }).error.message;

        will(msg).be('expected <[object Object]> to have all of these properties: <foo,bar>');
    });

    it('should make sense for haveOnly', function () {
        var msg = new ThrowAttempt(function () {
            will([1, 2]).haveOnly(1);
        }).error.message;

        will(msg).be('expected <1,2> to have only these items: <1>');
    });
});

describe('working with promises', function () {
    it('should not happen without "eventually"', function () {
        var result = will(1).be(1);
        will(result).not.exist();
    });

    it('should happen if "eventually" is used', function () {
        var result = will(1).eventually.be(1);
        will(result.constructor.name).be('Promise');
    });

    it('should work with "not.eventually" for success', function () {
        return Q.Promise(function (resolve, reject) {
            will(1).not.eventually.be(2).then(function () {
                resolve();
            }, function (err) {
                reject(new Error('not.eventually did not work'));
            });
        });
    });

    it('should work with "eventually.not" for success', function () {
        return Q.Promise(function (resolve, reject) {
            will(1).eventually.not.be(2).then(function () {
                resolve();
            }, function (err) {
                reject(new Error('not.eventually did not work'));
            });
        });
    });

    it('should work with "not.eventually" for errors', function () {
        return Q.Promise(function (resolve, reject) {
            will(1).not.eventually.be(1).then(function () {
                reject(new Error('not.eventually did not work'));
            }, function (err) {
                resolve();
            });
        });
    });

    it('should work with "eventually.not" for errors', function () {
        return Q.Promise(function (resolve, reject) {
            will(1).eventually.not.be(1).then(function () {
                reject(new Error('not.eventually did not work'));
            }, function (err) {
                resolve();
            });
        });
    });

    // it.only('should work aync', function () {
    //     var promise = Q.Promise(function (resolve, reject) {
    //         setTimeout(function () {
    //             console.log('ready');
    //             resolve(123);
    //         }, 300);
    //     });

    //     return will(promise).eventually.be(1234);
    // });

    it.only('should work aync', function () {
        var promise = Q.Promise(function (resolve, reject) {
            setTimeout(function () {
                console.log('ready');
                resolve(1234);
                // reject(new Error('promise broke'));
                // throw new Error('promise broke');
            }, 300);
        });

        return will(promise).eventually.be(123);
    });
});