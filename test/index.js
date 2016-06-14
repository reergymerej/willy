'use strict';

import assert from 'assert';
import willy, { will } from '../src';

function err(msg) {
  throw new Error(msg);
}

// get a basic promise that will return val
function p(val) {
  return Promise.resolve(val);
}

describe('will', () => {
  it('should return an Object', () => {
    assert(will() instanceof Object);
  });
});

describe('be', () => {
  it('should not throw if passes identity comparison', () => {
    assert.doesNotThrow(() => {
      will(3).be(3);
    });
  });

  it('should throw if fails identity comparison', () => {
    assert.throws(() => {
      will(3).be(4);
    });
  });
});

describe('beA/beAn', () => {
  it('should not throw if is an instanceof', () => {
    assert.doesNotThrow(() => {
      will([]).beAn(Array);
    });
  });

  it('should throw if item is not an instanceof', () => {
    assert.throws(() => {
      will([]).beA(String);
    });
  });

  it('should work for regular inheritance', () => {
    const Foo = () => {};
    const foo = new Foo();
    will(foo).beA(Foo);
  });
});

describe('beLike', () => {
  it('should not throw if passes equality comparison', () => {
    assert.doesNotThrow(() => {
      will('').beLike(false);
    });
  });

  it('should throw if fails equality comparison', () => {
    assert.throws(() => {
      will('').beLike(true);
    });
  });

  describe('when testing objects', () => {
    it('should throw when arrays do not match', () => {
      assert.throws(() => {
        will([1, 2, 3]).beLike([1, 2]);
      });
    });

    it('should throw when arrays match, but in wrong order', () => {
      assert.throws(() => {
        will([1, 2, 3]).beLike([3, 1, 2]);
      });
    });

    it('should throw when objects\' properties do not match', () => {
      assert.throws(() => {
        will({
          foo: 'bar',
          baz: 123,
          quux: null
        }).beLike({});
      });
    });

    it('should throw when objects\' values do not match (==)', () => {
      assert.throws(() => {
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

    it('should not throw when objects\' values match (==)', () => {
      assert.doesNotThrow(() => {
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

    it('should work when arrays are found', () => {
      assert.doesNotThrow(() => {
        will({
          foo: [1, 2, 3]
        }).beLike({
          foo: [1, 2, 3]
        });
      });
    });

    it('should throw when non-matching arrays are found', () => {
      assert.throws(() => {
        will({
          foo: [1, 2, 3]
        }).beLike({
          foo: [1, 2]
        });
      });
    });

    it('should work recursively', () => {
      assert.throws(() => {
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

describe('exist', () => {
  const foo = { bar: 1 };

  it('should not throw if item is defined', () => {
    assert.doesNotThrow(() => {
      will(foo.bar).exist();
    });
  });

  it('should throw if item is undefined', () => {
    assert.throws(() => {
      will(foo.baz).exist();
    });
  });
});

describe('throw', () => {
  it('should not throw if the fn throws', () => {
    assert.doesNotThrow(() => {
      will(() => {
        throw new Error('whoops');
      }).throw();
    });
  });

  it('should throw if the fn does not throw', () => {
    assert.throws(() => {
      will(() => {}).throw();
    });
  });
});

describe('have', () => {
  describe('when checking an Array', () => {
    describe('checking for a single item', () => {
      it('should not throw if the tested item is found', () => {
        assert.doesNotThrow(() => {
          will([1, 2, 3]).have(1);
        });
      });

      it('should throw if the tested item is not found', () => {
        assert.throws(() => {
          will([1, 2, 3]).have(5);
        });
      });
    });

    describe('checking for multiple items', () => {
      it('should not throw if it has all items', () => {
        assert.doesNotThrow(() => {
          will([1, 2, 3]).have([1, 3]);
        });
      });

      it('should throw if it does not have all items', () => {
        assert.throws(() => {
          will([1, 2, 3]).have([1, 2, 3, 4]);
        });
      });
    });
  });

  describe('when checking an Object', () => {
    describe('checking for single items', () => {
      it('should not throw if tested item has member', () => {
        assert.doesNotThrow(() => {
          will({foo: true}).have('foo');
        });
      });

      it('should throw if tested item does not have member', () => {
        assert.throws(() => {
          will({foo: true}).have('bar');
        });
      });
    });

    describe('checking for multiple items', () => {
      it('should not throw if it has all members', () => {
        assert.doesNotThrow(() => {
          will({
            foo: true,
            bar: true
          }).have(['foo', 'bar']);
        });
      });

      it('should throw if it does not have all members', () => {
        assert.throws(() => {
          will({
            foo: true,
            bar: true
          }).have(['foo', 'bar', 'baz']);
        });
      });
    });
  });
});

describe('haveOnly', () => {
  describe('when checking an Array', () => {
    it('should not throw if only has specified items', () => {
      assert.doesNotThrow(() => {
        will([1, 2, 3]).haveOnly([1, 2, 3]);
      });
    });

    it('should also work when specifying a single item', () => {
      assert.doesNotThrow(() => {
        will([3]).haveOnly(3);
      });
    });

    it('should throw when more than specified are present', () => {
      assert.throws(() => {
        will([1, 2, 3]).haveOnly([1, 2]);
      });
    });
  });

  describe('when checking an Object', () => {
    it('should not throw if only has specified items', () => {
      assert.doesNotThrow(() => {
        will({ foo: 1, bar: 1 }).haveOnly(['foo', 'bar']);
      });
    });

    it('should also work when specifying a single item', () => {
      assert.doesNotThrow(() => {
        will({ foo: 1 }).haveOnly('foo');
      });
    });

    it('should throw if has more than specified items', () => {
      assert.throws(() => {
        will({
          foo: 1,
          bar: 1,
          baz: 1
        }).haveOnly(['foo', 'bar']);
      });
    });
  });
});

describe('haveAny', () => {
  describe('when checking an Array', () => {
    it('should not throw if one of the props is found', () => {
      assert.doesNotThrow(() => {
        will([1, 2, 3]).haveAny([9, 8, 2]);
      });
    });

    it('should throw if none of the props is found', () => {
      assert.throws(() => {
        will([1, 2, 3]).haveAny([9, 8]);
      });
    });
  });

  describe('when checking an Object', () => {
    it('should not throw if one of the props is found', () => {
      assert.doesNotThrow(() => {
        will({ foo: 1 }).haveAny(['foo', 'bar', 'baz']);
      });
    });

    it('should throw if one of the props is found', () => {
      assert.throws(() => {
        will({ foo: 1 }).haveAny(['bar', 'baz']);
      });
    });
  });
});

describe('haveOwn', () => {
  const Foo = () => {};
  Foo.prototype.bar = true;

  let foo;

  beforeEach(() => {
    foo = new Foo();
    foo.baz = true;
  });

  afterEach(() => {
    foo = undefined;
  });

  it('should not throw if tested item has its own member', () => {
    assert.doesNotThrow(() => {
      will(foo).haveOwn('baz');
    });
  });

  it('should throw if tested item does not have its own member', () => {
    assert.throws(() => {
      will(foo).haveOwn('bar');
    });
  });
});

describe('match', () => {
  let foo;

  beforeEach(() => {
    foo = 'asdf';
  });

  afterEach(() => {
    foo = undefined;
  });

  it('should not throw if tested item matches regex', () => {
    assert.doesNotThrow(() => {
      will(foo).match(/SD/i);
    });
  });

  it('should throw if tested item does not match regex', () => {
    assert.throws(() => {
      will(foo).match(/SD/);
    });
  });

  describe('inverted', () => {
    it('should throw if tested item matches regex', () => {
      assert.throws(() => {
        will(foo).not.match(/SD/i);
      });
    });

    it('should not throw if tested item does not match regex', () => {
      assert.doesNotThrow(() => {
        will(foo).not.match(/SD/);
      });
    });
  });
});

describe('beDefined', () => {
  it('should not throw if tested item is defined', () => {
    const foo = 123;
    assert.doesNotThrow(() => {
      will(foo).beDefined();
    });
  });

  it('should throw if tested item is undefined', () => {
    let foo;
    assert.throws(() => {
      will(foo).beDefined();
    });
  });

  describe('inverted', () => {
    it('should throw if tested item is defined', () => {
      const foo = 123;
      assert.throws(() => {
        will(foo).not.beDefined();
      });
    });

    it('should not throw if tested item is undefined', () => {
      let foo;
      assert.doesNotThrow(() => {
        will(foo).not.beDefined();
      });
    });
  });
});

describe('beUndefined', () => {
  it('should not throw if tested item is undefined', () => {
    let foo;
    assert.doesNotThrow(() => {
      will(foo).beUndefined();
    });
  });

  it('should throw if tested item is not undefined', () => {
    const foo = 123;
    assert.throws(() => {
      will(foo).beUndefined();
    });
  });

  describe('inverted', () => {
    it('should throw if tested item is undefined', () => {
      let foo;
      assert.throws(() => {
        will(foo).not.beUndefined();
      });
    });

    it('should not throw if tested item is defined', () => {
      const foo = 123;
      assert.doesNotThrow(() => {
        will(foo).not.beUndefined();
      });
    });
  });
});

describe('beNull', () => {
  it('should not throw if tested item is null', () => {
    assert.doesNotThrow(() => {
      will(null).beNull();
    });
  });

  it('should throw if tested item is not null', () => {
    assert.throws(() => {
      will(undefined).beNull();
    });
  });

  describe('inverted', () => {
    it('should throw if tested item is null', () => {
      assert.throws(() => {
        will(null).not.beNull();
      });
    });

    it('should not throw if tested item is not null', () => {
      assert.doesNotThrow(() => {
        will(undefined).not.beNull();
      });
    });
  });
});

describe('beTruthy', () => {
  it('should not throw if tested item is truthy', () => {
    assert.doesNotThrow(() => {
      will('asdf').beTruthy();
    });
  });

  it('should throw if tested item is not truthy', () => {
    assert.throws(() => {
      will('').beTruthy();
    });
  });

  describe('inverted', () => {
    it('should throw if tested item is truthy', () => {
      assert.throws(() => {
        will('asdf').not.beTruthy();
      });
    });

    it('should not throw if tested item is not truthy', () => {
      assert.doesNotThrow(() => {
        will('').not.beTruthy();
      });
    });
  });
});

describe('beFalsy', () => {
  it('should not throw if tested item is falsy', () => {
    assert.doesNotThrow(() => {
      will('').beFalsy();
    });
  });

  it('should throw if tested item is not falsy', () => {
    assert.throws(() => {
      will('asdf').beFalsy();
    });
  });

  describe('inverted', () => {
    it('should throw if tested item is falsy', () => {
      assert.throws(() => {
        will('').not.beFalsy();
      });
    });

    it('should not throw if tested item is not falsy', () => {
      assert.doesNotThrow(() => {
        will('asdf').not.beFalsy();
      });
    });
  });
});

describe('beLessThan', () => {
  it('should not throw if item is less than expected', () => {
    assert.doesNotThrow(() => {
      will(3).beLessThan(4);
    });
  });

  it('should throw if item is not less than expected', () => {
    assert.throws(() => {
      will(3).beLessThan(3);
    });
  });

  describe('inverted', () => {
    it('should throw if item is less than expected', () => {
      assert.throws(() => {
        will(3).not.beLessThan(4);
      });
    });

    it('should not throw if item is not less than expected', () => {
      assert.doesNotThrow(() => {
        will(3).not.beLessThan(3);
      });
    });
  });
});

describe('beGreaterThan', () => {
  it('should not throw if item is greater than expected', () => {
    assert.doesNotThrow(() => {
      will(4).beGreaterThan(3);
    });
  });

  it('should throw if item is not greater than expected', () => {
    assert.throws(() => {
      will(3).beGreaterThan(3);
    });
  });

  describe('inverted', () => {
    it('should throw if item is greater than expected', () => {
      assert.throws(() => {
        will(4).not.beGreaterThan(3);
      });
    });

    it('should not throw if item is not greater than expected', () => {
      assert.doesNotThrow(() => {
        will(3).not.beGreaterThan(3);
      });
    });
  });
});

describe('not', () => {
  describe('be', () => {
    it('should throw if passes identity comparison', () => {
      assert.throws(() => {
        will(3).not.be(3);
      });
    });

    it('should not throw if fails identity comparison', () => {
      assert.doesNotThrow(() => {
        will(3).not.be(4);
      });
    });
  });

  describe('beLike', () => {
    it('should throw if passes equality comparison', () => {
      assert.throws(() => {
        will('').not.beLike(false);
      });
    });

    it('should not throw if fails equality comparison', () => {
      assert.doesNotThrow(() => {
        will('').not.beLike(true);
      });
    });
  });

  describe('beA/beAn', () => {
    it('should throw if is an instanceof', () => {
      assert.throws(() => {
        will([]).not.beAn(Array);
      });
    });

    it('should not throw if item is not an instanceof', () => {
      assert.doesNotThrow(() => {
        will([]).not.beA(String);
      });
    });
  });

  describe('exist', () => {
    const foo = { bar: 1 };

    it('should throw if item is defined', () => {
      assert.throws(() => {
        will(foo.bar).not.exist();
      });
    });

    it('should not throw if item is undefined', () => {
      assert.doesNotThrow(() => {
        will(foo.baz).not.exist();
      });
    });
  });

  describe('throw', () => {
    it('should throw if the fn throws', () => {
      assert.throws(() => {
        will(() => {
          throw new Error('whoops');
        }).not.throw();
      });
    });

    it('should not throw if the fn does not throw', () => {
      assert.doesNotThrow(() => {
        will(() => {}).not.throw();
      });
    });
  });

  describe('have', () => {
    describe('when checking an Array', () => {
      describe('checking for a single item', () => {
        it('should throw if the tested item is found', () => {
          assert.throws(() => {
            will([1, 2, 3]).not.have(1);
          });
        });

        it('should not throw if the tested item is not found', () => {
          assert.doesNotThrow(() => {
            will([1, 2, 3]).not.have(5);
          });
        });
      });

      describe('checking for multiple items', () => {
        it('should throw if it has all items', () => {
          assert.throws(() => {
            will([1, 2, 3]).not.have([1, 3]);
          });
        });

        it('should not throw if it does not have all items', () => {
          assert.doesNotThrow(() => {
            will([1, 2, 3]).not.have([1, 2, 3, 4]);
          });
        });
      });
    });

    describe('when checking an Object', () => {
      describe('checking for single items', () => {
        it('should throw if tested item has member', () => {
          assert.throws(() => {
            will({foo: true}).not.have('foo');
          });
        });

        it('should not throw if tested item does not have member', () => {
          assert.doesNotThrow(() => {
            will({foo: true}).not.have('bar');
          });
        });
      });

      describe('checking for multiple items', () => {
        it('should throw if it has all members', () => {
          assert.throws(() => {
            will({
              foo: true,
              bar: true
            }).not.have(['foo', 'bar']);
          });
        });

        it('should not throw if it does not have all members', () => {
          assert.doesNotThrow(() => {
            will({
              foo: true,
              bar: true
            }).not.have(['foo', 'bar', 'baz']);
          });
        });
      });
    });
  });

  describe('haveOnly', () => {
    describe('when checking an Array', () => {
      it('should throw if only has specified items', () => {
        assert.throws(() => {
          will([1, 2, 3]).not.haveOnly([1, 2, 3]);
        });
      });

      it('should not throw when more than specified are present', () => {
        assert.doesNotThrow(() => {
          will([1, 2, 3]).not.haveOnly([1, 2]);
        });
      });
    });

    describe('when checking an Object', () => {
      it('should throw if only has specified items', () => {
        assert.throws(() => {
          will({ foo: 1, bar: 1 }).not.haveOnly(['foo', 'bar']);
        });
      });

      it('should not throw if has more than specified items', () => {
        assert.doesNotThrow(() => {
          will({
            foo: 1,
            bar: 1,
            baz: 1
          }).not.haveOnly(['foo', 'bar']);
        });
      });
    });
  });

  describe('haveAny', () => {
    describe('when checking an Array', () => {
      it('should throw if one of the props is found', () => {
        assert.throws(() => {
          will([1, 2, 3]).not.haveAny([9, 8, 2]);
        });
      });

      it('should not throw if none of the props is found', () => {
        assert.doesNotThrow(() => {
          will([1, 2, 3]).not.haveAny([9, 8]);
        });
      });
    });

    describe('when checking an Object', () => {
      it('should throw if one of the props is found', () => {
        assert.throws(() => {
          will({ foo: 1 }).not.haveAny(['foo', 'bar', 'baz']);
        });
      });

      it('should not throw if one of the props is found', () => {
        assert.doesNotThrow(() => {
          will({ foo: 1 }).not.haveAny(['bar', 'baz']);
        });
      });
    });
  });

  describe('haveOwn', () => {
    let foo;
    const Foo = () => {};
    Foo.prototype.bar = true;

    beforeEach(() => {
      foo = new Foo();
      foo.baz = true;
    });

    afterEach(() => {
      foo = undefined;
    });

    it('should throw if tested item has its own member', () => {
      assert.throws(() => {
        will(foo).not.haveOwn('baz');
      });
    });

    it('should not throw if tested item does not have its own member', () => {
      assert.doesNotThrow(() => {
        will(foo).not.haveOwn('bar');
      });
    });
  });
});

describe('define', () => {

  describe('signature one', () => {
    before(() => {
      willy.define(function equal99() {
        return this.actual === 99;
      });
    });

    after(() => {
      delete will().constructor.prototype.equal99;
    });

    it('should allow you to add a test to Willy\'s repertoire', () => {
      assert.doesNotThrow(() => {
        will(99).equal99(99);
      });

      assert.throws(() => {
        will(99).not.equal99(99);
      });
    });
  });

  describe('signature two', () => {
    before(() => {
      willy.define({
        fn: function equal99() {
          return this.actual === 99;
        }
      });
    });

    after(() => {
      delete will().constructor.prototype.equal99;
    });

    it('should allow you to add a test to Willy\'s repertoire', () => {
      assert.doesNotThrow(() => {
        will(99).equal99(99);
      });

      assert.throws(() => {
        will(99).not.equal99(99);
      });
    });
  });
});

describe('loadDefinitions', () => {
  before(() => {
    willy.loadDefinitions({
      equal99: {
        name: 'equal99',
        fn: function (){
          return this.actual === 99;
        }
      }
    });
  });

  after(() => {
    delete will().constructor.prototype.equal99;
  });

  it('should work', () => {
    assert.doesNotThrow(() => {
      will(99).equal99();
    });
  });
});

describe('working with promises', () => {
  it('should work with "not.eventually" for success', () => {
    return will(p(1)).eventually.not.be(2).then(() => {
    }, () => {
        err('should not have thrown an error');
      });
  });

  it('should work with "eventually.not" for success', () => {
    return will(p(1)).eventually.not.be(2).then(() => {
    }, () => {
        err('should not have thrown an error');
      });
  });

  it('should work with "not.eventually" for errors', () => {
    return will(p(1)).not.eventually.be(1).then(() => {
        err('should have thrown an error');
      }, () => {
        // failed like it should have
      });
  });

  it('should work with "eventually.not" for errors', () => {
    return will(p(1)).eventually.not.be(1).then(
      () => {
        err('should have thrown an error');
      }, () => {
        // failed like it should have
      });
  });

  it('should work async', () => {
    const promise = Promise.reject(123);

    // Intercept the promise so we can decide if it
    // failed or not.
    return will(promise).eventually.be(123).then(

      // promise fulfilled
      () => {
        err('should have thrown an error');
      },

      // promise rejected
      () => {
        // failed like it should have
      }
    );
  });
});

describe('fix instanceof for literals', () => {
  it('should work for Strings', () => {
    will('asdf').beA(String);
  });

  it('should work for Objects', () => {
    will({}).beAn(Object);
  });

  it('should work for Arrays', () => {
    will([]).beAn(Array);
  });

  it('should work for Numbers', () => {
    will(42).beA(Number);
  });

  it('should work for Booleans', () => {
    will(true).beA(Boolean);
  });
});
