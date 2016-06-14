import assert from 'assert';
import { will } from '../../src';

describe('beLike', () => {
  it('should not throw if passes equality comparison', () => {
    assert.doesNotThrow(() => {
      will('').beLike(false);
    });
  });

  it('should throw if fails equality comparison', () => {
    assert.throws(() => {
      will('').beLike(true);
    });
  });

  describe('when testing objects', () => {
    it('should throw when arrays do not match', () => {
      assert.throws(() => {
        will([1, 2, 3]).beLike([1, 2]);
      });
    });

    it('should throw when arrays match, but in wrong order', () => {
      assert.throws(() => {
        will([1, 2, 3]).beLike([3, 1, 2]);
      });
    });

    it('should throw when objects\' properties do not match', () => {
      assert.throws(() => {
        will({
          foo: 'bar',
          baz: 123,
          quux: null
        }).beLike({});
      });
    });

    it('should throw when objects\' values do not match (==)', () => {
      assert.throws(() => {
        will({
          foo: 'bar',
          baz: 123,
          quux: null
        }).beLike({
          foo: 'bingo',
          baz: 'bango',
          quux: 'bongo'
        });
      });
    });

    it('should not throw when objects\' values match (==)', () => {
      assert.doesNotThrow(() => {
        will({
          foo: 'bar',
          baz: [1, 2, 3],
          quux: null
        }).beLike({
          foo: 'bar',
          baz: [1, 2, 3],
          quux: null
        });
      });
    });

    it('should work when arrays are found', () => {
      assert.doesNotThrow(() => {
        will({
          foo: [1, 2, 3]
        }).beLike({
          foo: [1, 2, 3]
        });
      });
    });

    it('should throw when non-matching arrays are found', () => {
      assert.throws(() => {
        will({
          foo: [1, 2, 3]
        }).beLike({
          foo: [1, 2]
        });
      });
    });

    it('should work recursively', () => {
      assert.throws(() => {
        will({
          foo: {
            bar: {
              baz: {
                quux: true
              }
            }
          }
        }).beLike({
          foo: {
            bar: {
              baz: {
                quux: false
              }
            }
          }
        });

        will({
          foo: true,
          bar: [1, 2, 3]
        }).beLike({
          foo: true,
          bar: [1, 2, 3]
        });
      });
    });
  });
});
