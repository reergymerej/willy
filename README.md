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

## Installation

Use [npm](https://www.npmjs.org/doc/README.html), man.  Keep it simple.

    npm install willy --save-dev


## Usage

View the [wiki](https://github.com/reergymerej/willy/wiki) for details.