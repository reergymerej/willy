import assert from 'assert';
import { will } from '../../src';

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
