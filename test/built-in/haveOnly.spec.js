import assert from 'assert';
import { will } from '../../src';

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
