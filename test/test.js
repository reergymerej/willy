'use strict';

var assert = require('assert');
var Q = require('q');
var willy = require('../index'),
    will = willy.will;

var err = function (msg) {
    throw new Error(msg);
};

// get a basic promise that will return val
var p = function (val) {
    return Q.fcall(function () { return val; });
};

describe('will', function () {
    it('should return an Object', function () {
        assert(will() instanceof Object);
    });
});

describe('be', function () {
    it('should not throw if passes identity comparison', function () {
        assert.doesNotThrow(function () {
            will(3).be(3);
        });
    });

    it('should throw if fails identity comparison', function () {
        assert.throws(function () {
            will(3).be(4);
        });
    });
});

describe('beA/beAn', function () {
    it('should not throw if is an instanceof', function () {
        assert.doesNotThrow(function () {
            will([]).beAn(Array);
        });
    });

    it('should throw if item is not an instanceof', function () {
        assert.throws(function () {
            will([]).beA(String);
        });
    });

    it('should work for regular inheritance', function () {
        var Foo = function () {};
        var foo = new Foo();
        will(foo).beA(Foo);
    });
});

describe('beLike', function () {
    it('should not throw if passes equality comparison', function () {
        assert.doesNotThrow(function () {
            will('').beLike(false);
        });
    });

    it('should throw if fails equality comparison', function () {
        assert.throws(function () {
            will('').beLike(true);
        });
    });

    describe('when testing objects', function () {
        it('should throw when arrays do not match', function () {
            assert.throws(function () {
                will([1, 2, 3]).beLike([1, 2]);
            });
        });

        it('should throw when arrays match, but in wrong order', function () {
            assert.throws(function () {
                will([1, 2, 3]).beLike([3, 1, 2]);
            });
        });

        it('should throw when objects\' properties do not match', function () {
            assert.throws(function () {
                will({
                    foo: 'bar',
                    baz: 123,
                    quux: null
                }).beLike({});
            });
        });

        it('should throw when objects\' values do not match (==)', function () {
            assert.throws(function () {
                will({
                    foo: 'bar',
                    baz: 123,
                    quux: null
                }).beLike({
                    foo: 'bingo',
                    baz: 'bango',
                    quux: 'bongo'
                });
            });
        });

        it('should not throw when objects\' values match (==)', function () {
            assert.doesNotThrow(function () {
                will({
                    foo: 'bar',
                    baz: [1, 2, 3],
                    quux: null
                }).beLike({
                    foo: 'bar',
                    baz: [1, 2, 3],
                    quux: null
                });
            });
        });

        it('should work when arrays are found', function () {
            assert.doesNotThrow(function () {
                will({
                    foo: [1, 2, 3]
                }).beLike({
                    foo: [1, 2, 3]  
                });
            });
        });

        it('should throw when non-matching arrays are found', function () {
            assert.throws(function () {
                will({
                    foo: [1, 2, 3]
                }).beLike({
                    foo: [1, 2]
                });
            });
        });

        it('should work recursively', function () {
            assert.throws(function () {
                will({
                    foo: {
                        bar: {
                            baz: {
                                quux: true
                            }
                        }
                    }
                }).beLike({
                    foo: {
                        bar: {
                            baz: {
                                quux: false
                            }
                        }
                    }
                });

                will({
                    foo: true,
                    bar: [1, 2, 3]
                }).beLike({
                    foo: true,
                    bar: [1, 2, 3]
                });
            });
        });
    });
});

describe('exist', function () {
    var foo = { bar: 1 };

    it('should not throw if item is defined', function () {
        assert.doesNotThrow(function () {
            will(foo.bar).exist();
        });
    });

    it('should throw if item is undefined', function () {
        assert.throws(function () {
            will(foo.baz).exist();
        });
    });
});

describe('throw', function () {
    it('should not throw if the fn throws', function () {
        assert.doesNotThrow(function () {
            will(function () {
                throw new Error('whoops');
            }).throw();
        });
    });

    it('should throw if the fn does not throw', function () {
        assert.throws(function () {
            will(function () {}).throw();
        });
    });
});

describe('have', function () {
    describe('when checking an Array', function () {
        describe('checking for a single item', function () {
            it('should not throw if the tested item is found', function () {
                assert.doesNotThrow(function () {
                    will([1, 2, 3]).have(1);
                });
            });

            it('should throw if the tested item is not found', function () {
                assert.throws(function () {
                    will([1, 2, 3]).have(5);
                });
            });
        });

        describe('checking for multiple items', function () {
            it('should not throw if it has all items', function () {
                assert.doesNotThrow(function () {
                    will([1, 2, 3]).have([1, 3]);
                });
            });

            it('should throw if it does not have all items', function () {
                assert.throws(function () {
                    will([1, 2, 3]).have([1, 2, 3, 4]);
                });
            });
        });
    });

    describe('when checking an Object', function () {
        describe('checking for single items', function () {
            it('should not throw if tested item has member', function () {
                assert.doesNotThrow(function () {
                    will({foo: true}).have('foo');
                });
            });

            it('should throw if tested item does not have member', function () {
                assert.throws(function () {
                    will({foo: true}).have('bar');
                });
            });
        });

        describe('checking for multiple items', function () {
            it('should not throw if it has all members', function () {
                assert.doesNotThrow(function () {
                    will({
                        foo: true,
                        bar: true
                    }).have(['foo', 'bar']);
                });
            });

            it('should throw if it does not have all members', function () {
                assert.throws(function () {
                    will({
                        foo: true,
                        bar: true
                    }).have(['foo', 'bar', 'baz']);
                });
            });
        });
    });
});

describe('haveOnly', function () {
    describe('when checking an Array', function () {
        it('should not throw if only has specified items', function () {
            assert.doesNotThrow(function () {
                will([1, 2, 3]).haveOnly([1, 2, 3]);
            });
        });

        it('should also work when specifying a single item', function () {
            assert.doesNotThrow(function () {
                will([3]).haveOnly(3);
            });
        });

        it('should throw when more than specified are present', function () {
            assert.throws(function () {
                will([1, 2, 3]).haveOnly([1, 2]);
            });
        });
    });

    describe('when checking an Object', function () {
        it('should not throw if only has specified items', function () {
            assert.doesNotThrow(function () {
                will({ foo: 1, bar: 1 }).haveOnly(['foo', 'bar']);
            });
        });

        it('should also work when specifying a single item', function () {
            assert.doesNotThrow(function () {
                will({ foo: 1 }).haveOnly('foo');
            });
        });

        it('should throw if has more than specified items', function () {
            assert.throws(function () {
                will({
                    foo: 1,
                    bar: 1,
                    baz: 1
                }).haveOnly(['foo', 'bar']);
            });
        });
    });
});

describe('haveAny', function () {
    describe('when checking an Array', function () {
        it('should not throw if one of the props is found', function () {
            assert.doesNotThrow(function () {
                will([1, 2, 3]).haveAny([9, 8, 2]);
            });
        });

        it('should throw if none of the props is found', function () {
            assert.throws(function () {
                will([1, 2, 3]).haveAny([9, 8]);
            });
        });
    });

    describe('when checking an Object', function () {
        it('should not throw if one of the props is found', function () {
            assert.doesNotThrow(function () {
                will({ foo: 1 }).haveAny(['foo', 'bar', 'baz']);
            });
        });

        it('should throw if one of the props is found', function () {
            assert.throws(function () {
                will({ foo: 1 }).haveAny(['bar', 'baz']);
            });
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
        assert.doesNotThrow(function () {
            will(foo).haveOwn('baz');
        });
    });

    it('should throw if tested item does not have its own member', function () {
        assert.throws(function () {
            will(foo).haveOwn('bar');
        });
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
        assert.doesNotThrow(function () {
            will(foo).match(/SD/i);
        });
    });

    it('should throw if tested item does not match regex', function () {
        assert.throws(function () {
            will(foo).match(/SD/);
        });
    });

    describe('inverted', function () {
        it('should throw if tested item matches regex', function () {
            assert.throws(function () {
                will(foo).not.match(/SD/i);
            });
        });

        it('should not throw if tested item does not match regex', function () {
            assert.doesNotThrow(function () {
                will(foo).not.match(/SD/);
            });
        });
    });
});

describe('beDefined', function () {
    it('should not throw if tested item is defined', function () {
        var foo = 123;
        assert.doesNotThrow(function () {
            will(foo).beDefined();
        });
    });

    it('should throw if tested item is undefined', function () {
        var foo;
        assert.throws(function () {
            will(foo).beDefined();
        });
    });

    describe('inverted', function () {
        it('should throw if tested item is defined', function () {
            var foo = 123;
            assert.throws(function () {
                will(foo).not.beDefined();
            });
        });

        it('should not throw if tested item is undefined', function () {
            var foo;
            assert.doesNotThrow(function () {
                will(foo).not.beDefined();
            });
        });
    });
});

describe('beUndefined', function () {
    it('should not throw if tested item is undefined', function () {
        var foo;
        assert.doesNotThrow(function () {
            will(foo).beUndefined();
        });
    });

    it('should throw if tested item is not undefined', function () {
        var foo = 123;
        assert.throws(function () {
            will(foo).beUndefined();
        });
    });

    describe('inverted', function () {
        it('should throw if tested item is undefined', function () {
            var foo;
            assert.throws(function () {
                will(foo).not.beUndefined();
            });
        });

        it('should not throw if tested item is defined', function () {
            var foo = 123;
            assert.doesNotThrow(function () {
                will(foo).not.beUndefined();
            });
        });
    });
});

describe('beNull', function () {
    it('should not throw if tested item is null', function () {
        assert.doesNotThrow(function () {
            will(null).beNull();
        });
    });

    it('should throw if tested item is not null', function () {
        assert.throws(function () {
            will(undefined).beNull();
        });
    });

    describe('inverted', function () {
        it('should throw if tested item is null', function () {
            assert.throws(function () {
                will(null).not.beNull();
            });
        });

        it('should not throw if tested item is not null', function () {
            assert.doesNotThrow(function () {
                will(undefined).not.beNull();
            });
        });
    });
});

describe('beTruthy', function () {
    it('should not throw if tested item is truthy', function () {
        assert.doesNotThrow(function () {
            will('asdf').beTruthy();
        });
    });

    it('should throw if tested item is not truthy', function () {
        assert.throws(function () {
            will('').beTruthy();
        });
    });

    describe('inverted', function () {
        it('should throw if tested item is truthy', function () {
            assert.throws(function () {
                will('asdf').not.beTruthy();
            });
        });

        it('should not throw if tested item is not truthy', function () {
            assert.doesNotThrow(function () {
                will('').not.beTruthy();
            });
        });
    });
});

describe('beFalsy', function () {
    it('should not throw if tested item is falsy', function () {
        assert.doesNotThrow(function () {
            will('').beFalsy();
        });
    });

    it('should throw if tested item is not falsy', function () {
        assert.throws(function () {
            will('asdf').beFalsy();
        });
    });

    describe('inverted', function () {
        it('should throw if tested item is falsy', function () {
            assert.throws(function () {
                will('').not.beFalsy();
            });
        });

        it('should not throw if tested item is not falsy', function () {
            assert.doesNotThrow(function () {
                will('asdf').not.beFalsy();
            });
        });
    });
});

describe('beLessThan', function () {
    it('should not throw if item is less than expected', function () {
        assert.doesNotThrow(function () {
            will(3).beLessThan(4);
        });
    });

    it('should throw if item is not less than expected', function () {
        assert.throws(function () {
            will(3).beLessThan(3);
        });
    });

    describe('inverted', function () {
        it('should throw if item is less than expected', function () {
            assert.throws(function () {
                will(3).not.beLessThan(4);
            });
        });

        it('should not throw if item is not less than expected', function () {
            assert.doesNotThrow(function () {
                will(3).not.beLessThan(3);
            });
        });
    });
});

describe('beGreaterThan', function () {
    it('should not throw if item is greater than expected', function () {
        assert.doesNotThrow(function () {
            will(4).beGreaterThan(3);
        });
    });

    it('should throw if item is not greater than expected', function () {
        assert.throws(function () {
            will(3).beGreaterThan(3);
        });
    });

    describe('inverted', function () {
        it('should throw if item is greater than expected', function () {
            assert.throws(function () {
                will(4).not.beGreaterThan(3);
            });
        });

        it('should not throw if item is not greater than expected', function () {
            assert.doesNotThrow(function () {
                will(3).not.beGreaterThan(3);
            });
        });
    });
});

describe('not', function () {
    describe('be', function () {
        it('should throw if passes identity comparison', function () {
            assert.throws(function () {
                will(3).not.be(3);
            });
        });

        it('should not throw if fails identity comparison', function () {
            assert.doesNotThrow(function () {
                will(3).not.be(4);
            });
        });
    });

    describe('beLike', function () {
        it('should throw if passes equality comparison', function () {
            assert.throws(function () {
                will('').not.beLike(false);
            });
        });

        it('should not throw if fails equality comparison', function () {
            assert.doesNotThrow(function () {
                will('').not.beLike(true);
            });
        });
    });

    describe('beA/beAn', function () {
        it('should throw if is an instanceof', function () {
            assert.throws(function () {
                will([]).not.beAn(Array);
            });
        });

        it('should not throw if item is not an instanceof', function () {
            assert.doesNotThrow(function () {
                will([]).not.beA(String);
            });
        });
    });

    describe('exist', function () {
        var foo = { bar: 1 };

        it('should throw if item is defined', function () {
            assert.throws(function () {
                will(foo.bar).not.exist();
            });
        });

        it('should not throw if item is undefined', function () {
            assert.doesNotThrow(function () {
                will(foo.baz).not.exist();
            });
        });
    });

    describe('throw', function () {
        it('should throw if the fn throws', function () {
            assert.throws(function () {
                will(function () {
                    throw new Error('whoops');
                }).not.throw();
            });
        });

        it('should not throw if the fn does not throw', function () {
            assert.doesNotThrow(function () {
                will(function () {}).not.throw();
            });
        });
    });

    describe('have', function () {
        describe('when checking an Array', function () {
            describe('checking for a single item', function () {
                it('should throw if the tested item is found', function () {
                    assert.throws(function () {
                        will([1, 2, 3]).not.have(1);
                    });
                });

                it('should not throw if the tested item is not found', function () {
                    assert.doesNotThrow(function () {
                        will([1, 2, 3]).not.have(5);
                    });
                });
            });

            describe('checking for multiple items', function () {
                it('should throw if it has all items', function () {
                    assert.throws(function () {
                        will([1, 2, 3]).not.have([1, 3]);
                    });
                });

                it('should not throw if it does not have all items', function () {
                    assert.doesNotThrow(function () {
                        will([1, 2, 3]).not.have([1, 2, 3, 4]);
                    });
                });
            });
        });

        describe('when checking an Object', function () {
            describe('checking for single items', function () {
                it('should throw if tested item has member', function () {
                    assert.throws(function () {
                        will({foo: true}).not.have('foo');
                    });
                });

                it('should not throw if tested item does not have member', function () {
                    assert.doesNotThrow(function () {
                        will({foo: true}).not.have('bar');
                    });
                });
            });

            describe('checking for multiple items', function () {
                it('should throw if it has all members', function () {
                    assert.throws(function () {
                        will({
                            foo: true,
                            bar: true
                        }).not.have(['foo', 'bar']);
                    });
                });

                it('should not throw if it does not have all members', function () {
                    assert.doesNotThrow(function () {
                        will({
                            foo: true,
                            bar: true
                        }).not.have(['foo', 'bar', 'baz']);
                    });
                });
            });
        });
    });

    describe('haveOnly', function () {
        describe('when checking an Array', function () {
            it('should throw if only has specified items', function () {
                assert.throws(function () {
                    will([1, 2, 3]).not.haveOnly([1, 2, 3]);
                });
            });

            it('should not throw when more than specified are present', function () {
                assert.doesNotThrow(function () {
                    will([1, 2, 3]).not.haveOnly([1, 2]);
                });
            });
        });

        describe('when checking an Object', function () {
            it('should throw if only has specified items', function () {
                assert.throws(function () {
                    will({ foo: 1, bar: 1 }).not.haveOnly(['foo', 'bar']);
                });
            });

            it('should not throw if has more than specified items', function () {
                assert.doesNotThrow(function () {
                    will({
                        foo: 1,
                        bar: 1,
                        baz: 1
                    }).not.haveOnly(['foo', 'bar']);
                });
            });
        });
    });

    describe('haveAny', function () {
        describe('when checking an Array', function () {
            it('should throw if one of the props is found', function () {
                assert.throws(function () {
                    will([1, 2, 3]).not.haveAny([9, 8, 2]);
                });
            });

            it('should not throw if none of the props is found', function () {
                assert.doesNotThrow(function () {
                    will([1, 2, 3]).not.haveAny([9, 8]);
                });
            });
        });

        describe('when checking an Object', function () {
            it('should throw if one of the props is found', function () {
                assert.throws(function () {
                    will({ foo: 1 }).not.haveAny(['foo', 'bar', 'baz']);
                });
            });

            it('should not throw if one of the props is found', function () {
                assert.doesNotThrow(function () {
                    will({ foo: 1 }).not.haveAny(['bar', 'baz']);
                });
            });
        });
    });

    describe('haveOwn', function () {
        var foo;
        var Foo = function () {};
        Foo.prototype.bar = true;

        beforeEach(function () {
            foo = new Foo();
            foo.baz = true;
        });

        afterEach(function () {
            foo = undefined;
        });

        it('should throw if tested item has its own member', function () {
            assert.throws(function () {
                will(foo).not.haveOwn('baz');
            });
        });

        it('should not throw if tested item does not have its own member', function () {
            assert.doesNotThrow(function () {
                will(foo).not.haveOwn('bar');
            });
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
        assert.throws(function () {
            will(98).equal99();
        });
    });

    it('should work with not', function () {
        assert.doesNotThrow(function () {
            will(98).not.equal99();
        });
    });

    describe('when the fn has arguments', function () {
        before(function () {

            willy.addTest(function beLongerThan(expectedValue) {
                return this.if(

                    // a function passed the value being tested
                    function (actualValue) {

                        // return the result of your test
                        return actualValue.length > expectedValue.length;
                    },

                    // a string explaining what you were testing
                    'be longer than',

                    // the value tested (optional)
                    expectedValue
                );
            });
        });

        after(function () {
            delete will().constructor.prototype.beLongerThan;
        });

        it('should work when not throwing', function () {
            assert.doesNotThrow(function () {
                will('12345').beLongerThan('123');
            });
        });

        it('should work when throwing', function () {
            assert.throws(function () {
                will('12345').beLongerThan('12345');
            });
        });
    });
});

describe('define', function () {

    describe('signature one', function () {
        before(function () {
            willy.define(function equal99() {
                return this.actual === 99;
            });
        });

        after(function () {
            delete will().constructor.prototype.equal99;
        });

        it('should allow you to add a test to Willy\'s repertoire', function () {
            assert.doesNotThrow(function () {
                will(99).equal99(99);
            });

            assert.throws(function () {
                will(99).not.equal99(99);
            });
        });
    });

    describe('signature two', function () {
        before(function () {
            willy.define({
                fn: function equal99() {
                    return this.actual === 99;
                }
            });
        });

        after(function () {
            delete will().constructor.prototype.equal99;
        });

        it('should allow you to add a test to Willy\'s repertoire', function () {
            assert.doesNotThrow(function () {
                will(99).equal99(99);
            });

            assert.throws(function () {
                will(99).not.equal99(99);
            });
        });
    });
});

describe('loadDefinitions', function () {
    before(function () {
        willy.loadDefinitions({
            equal99: {
                fn: function () {
                    return this.actual === 99;
                }
            }
        });
    });

    after(function () {
        delete will().constructor.prototype.equal99;
    });

    it('should work', function () {
        assert.doesNotThrow(function () {
            will(99).equal99();
        });
    });  
});

describe('working with promises', function () {
    it('should work with "not.eventually" for success', function () {
        return will(p(1)).eventually.not.be(2).then(function (value) {
            }, function () {
                err('should not have thrown an error');
            });
    });

    it('should work with "eventually.not" for success', function () {
        return will(p(1)).eventually.not.be(2).then(function () {
            }, function () {
                err('should not have thrown an error');
            });
    });

    it('should work with "not.eventually" for errors', function () {
        return will(p(1)).not.eventually.be(1).then(function () {
                err('should have thrown an error');
            }, function () {
                // failed like it should have
            });
    });

    it('should work with "eventually.not" for errors', function () {
        return will(p(1)).eventually.not.be(1).then(
            function () {
                err('should have thrown an error');
            }, function () {
                // failed like it should have
            });
    });

    it('should work async', function () {
        var promise = Q.Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(1234);
                // reject('broke own promise');
            }, 10);
        });

        // Intercept the promise so we can decide if it
        // failed or not.
        return will(promise).eventually.be(123).then(
            
            // promise fulfilled
            function () {
                err('should have thrown an error');
            },

            // promise rejected
            function (err) {
                // failed like it should have
            }
        );
    });
});

describe('fix instanceof for literals', function () {
    it('should work for Strings', function () {
        will('asdf').beA(String);
    });

    it('should work for Objects', function () {
        will({}).beAn(Object);
    });

    it('should work for Arrays', function () {
        will([]).beAn(Array);
    });

    it('should work for Numbers', function () {
        will(42).beA(Number);
    });

    it('should work for Booleans', function () {
        will(true).beA(Boolean);
    });
});