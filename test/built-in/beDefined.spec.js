import assert from 'assert';
import { will } from '../../src';

describe('beDefined', () => {
  it('should not throw if tested item is defined', () => {
    const foo = 123;
    assert.doesNotThrow(() => {
      will(foo).beDefined();
    });
  });

  it('should throw if tested item is undefined', () => {
    let foo;
    assert.throws(() => {
      will(foo).beDefined();
    });
  });

  describe('inverted', () => {
    it('should throw if tested item is defined', () => {
      const foo = 123;
      assert.throws(() => {
        will(foo).not.beDefined();
      });
    });

    it('should not throw if tested item is undefined', () => {
      let foo;
      assert.doesNotThrow(() => {
        will(foo).not.beDefined();
      });
    });
  });
});
