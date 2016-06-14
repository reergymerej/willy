import assert from 'assert';
import { will } from '../../src';

describe('exist', () => {
  const foo = { bar: 1 };

  it('should not throw if item is defined', () => {
    assert.doesNotThrow(() => {
      will(foo.bar).exist();
    });
  });

  it('should throw if item is undefined', () => {
    assert.throws(() => {
      will(foo.baz).exist();
    });
  });
});
