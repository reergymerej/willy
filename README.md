# Cry Baby

An assertion library.

## Examples

```js
describe('some test suite', function () {
    it('should blah blah blah', function () {
        
        // test identity
        will(3).be(3);

        // test for an item in an array
        will([1, 2, 3]).have(3);
    });
});
```
