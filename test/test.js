var will = require('../index').will;

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