# Willy

Willy is an assertion library designed to be simple and readable.  It doesn't follow the normal BDD/TDD assertion styles, but reads more like questions.

```js
var will = require('willy').will;

describe('some test suite', function () {
    it('should do X, Y, and Z', function () {

        // Will it?
        will(true).be(true);

    });
});
```

**Willy**...
* is super easy to use
* includes a bunch of built-in tests
* makes custom tests easy
* supports promises

Keep it simple, so you can focus on your code, not your tests.  Compare testing `instanceof` in a few different assertion libraries.

```javascript
// Chai
expect(foo).to.be.an.instanceof(Foo);

// Shouldjs
foo.should.be.an.instanceOf(Foo)

// Jasmine
expect(foo).toEqual(jasmine.any(Foo));

// Willy
will(foo).beA(Foo);
```

## Installation

Use [npm](https://www.npmjs.org/doc/README.html), man.  Keep it simple.

    npm install willy --save-dev


## Usage

View the [wiki](https://github.com/reergymerej/willy/wiki) for details.