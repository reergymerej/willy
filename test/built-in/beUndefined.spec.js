import assert from 'assert';
import { will } from '../../src';

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
