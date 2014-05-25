# Willy

An assertion library.

## Examples

```js
describe('some test suite', function () {
    it('should blah blah blah', function () {
        
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

        // multiple items in an Array
        will([1, 2, 3]).have([1, 3]);

        // item in an Object (any object)
        will({foo: true}).have('foo');

        // multiple items in an Object
        will({ foo: true, bar: true }).have(['foo', 'bar']);

        // own properties
        will(foo).haveOwn('baz');
    });
});
```
