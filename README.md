# Cry Baby

An assertion library.

## Examples

```js
describe('some test suite', function () {
    it('should blah blah blah', function () {
        
        // test identity
        will(3).be(3);

        // expected Errors
        // (Pass the reference, don't execute it.)
        will(foo.someFn).throw();

        // test for an item in an Array
        will([1, 2, 3]).have(3);
    });
});
```
