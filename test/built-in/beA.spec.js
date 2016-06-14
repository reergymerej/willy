import assert from 'assert';
import { will } from '../../src';

describe('beA/beAn', () => {
  it('should not throw if is an instanceof', () => {
    assert.doesNotThrow(() => {
      will([]).beAn(Array);
    });
  });

  it('should throw if item is not an instanceof', () => {
    assert.throws(() => {
      will([]).beA(String);
    });
  });

  it('should work for regular inheritance', () => {
    const Foo = () => {};
    const foo = new Foo();
    will(foo).beA(Foo);
  });
});
