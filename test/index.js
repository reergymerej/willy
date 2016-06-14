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
