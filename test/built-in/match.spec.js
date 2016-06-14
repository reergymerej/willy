import assert from 'assert';
import { will } from '../../src';

describe('match', () => {
  let foo;

  beforeEach(() => {
    foo = 'asdf';
  });

  afterEach(() => {
    foo = undefined;
  });

  it('should not throw if tested item matches regex', () => {
    assert.doesNotThrow(() => {
      will(foo).match(/SD/i);
    });
  });

  it('should throw if tested item does not match regex', () => {
    assert.throws(() => {
      will(foo).match(/SD/);
    });
  });

  describe('inverted', () => {
    it('should throw if tested item matches regex', () => {
      assert.throws(() => {
        will(foo).not.match(/SD/i);
      });
    });

    it('should not throw if tested item does not match regex', () => {
      assert.doesNotThrow(() => {
        will(foo).not.match(/SD/);
      });
    });
  });
});
