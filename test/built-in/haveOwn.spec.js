import assert from 'assert';
import { will } from '../../src';

describe('haveOwn', () => {
  const Foo = () => {};
  Foo.prototype.bar = true;

  let foo;

  beforeEach(() => {
    foo = new Foo();
    foo.baz = true;
  });

  afterEach(() => {
    foo = undefined;
  });

  it('should not throw if tested item has its own member', () => {
    assert.doesNotThrow(() => {
      will(foo).haveOwn('baz');
    });
  });

  it('should throw if tested item does not have its own member', () => {
    assert.throws(() => {
      will(foo).haveOwn('bar');
    });
  });
});
