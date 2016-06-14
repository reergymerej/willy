import assert from 'assert';
import { will } from '../../src';

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
