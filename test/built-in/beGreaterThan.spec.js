import assert from 'assert';
import { will } from '../../src';

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
