import assert from 'assert';
import { will } from '../../src';

describe('throw', () => {
  it('should not throw if the fn throws', () => {
    assert.doesNotThrow(() => {
      will(() => {
        throw new Error('whoops');
      }).throw();
    });
  });

  it('should throw if the fn does not throw', () => {
    assert.throws(() => {
      will(() => {}).throw();
    });
  });
});
