import assert from 'assert';
import { will } from '../../src';

describe('be', () => {
  it('should not throw if passes identity comparison', () => {
    assert.doesNotThrow(() => {
      will(3).be(3);
    });
  });

  it('should throw if fails identity comparison', () => {
    assert.throws(() => {
      will(3).be(4);
    });
  });
});
