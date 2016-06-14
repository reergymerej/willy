import assert from 'assert';
import { will } from '../../src';

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
