import assert from 'assert';
import { will } from '../../src';

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
