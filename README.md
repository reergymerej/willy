# Willy

This is an assertion library designed to be simple and readable.  It doesn't follow the normal BDD/TDD assertion styles, but reads more like questions.

```js
describe('some test suite', function () {
    it('should do X, Y, and Z', function () {

        // Will it?
        will(true).be(true);

    });
});
```

## Examples

```js
var will = require('willy').will;

describe('some test suite', function () {
    it('should do X, Y, and Z', function () {
        
        // identity
        will(3).be(3);

        // equality
        will('').beLike(false);

        // inheritance
        will('').beA(String);
        will([]).beAn(Array);

        // expected Errors
        will(someFn).throw();

        // item in an Array
        will([1, 2, 3]).have(3);
        will([1, 2, 3]).have([1, 3]);

        // only specific items in an Array
        will([3]).haveOnly(3);
        will([1, 2, 3]).haveOnly([1, 2, 3]);

        // at least one item in an Array
        will([1, 2, 3]).haveAny([99, 66, 2]);

        // property in an Object (any object)
        will({foo: true}).have('foo');
        will({ foo: true, bar: true }).have(['foo', 'bar']);

        // only specific properties in an Object
        will({ foo: 1 }).haveOnly('foo');
        will({ foo: 1, bar: 1 }).haveOnly(['foo', 'bar']);

        // at least one property in an Array
        will({ foo: 1 }).haveAny(['foo', 'bar', 'baz']);

        // own properties
        will(foo).haveOwn('baz');

        // negate any question
        will(3).not.be(4);
    });
});
```
