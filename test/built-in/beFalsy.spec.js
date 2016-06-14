import assert from 'assert';
import { will } from '../../src';

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
