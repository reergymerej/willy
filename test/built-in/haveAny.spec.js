import assert from 'assert';
import { will } from '../../src';

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
