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

## API

### Index

**Tests**
* be
* beDefined
* beA/beAn
* beLike
* eventually
* exist
* have
* haveAny
* haveOnly
* haveOwn
* match
* not
* throw

The 'toBeDefined' matcher compares against `undefined`
The `toBeUndefined` matcher compares against `undefined`
The 'toBeNull' matcher compares against null
The 'toBeTruthy' matcher is for boolean casting testing
The 'toBeFalsy' matcher is for boolean casting testing
The 'toContain' matcher is for finding an item in an Array
The 'toBeLessThan' matcher is for mathematical comparisons
The 'toBeGreaterThan' matcher is for mathematical comparisons
The 'toBeCloseTo' matcher is for precision math comparison

**Utilities**
* addTest

#### Tests

##### be 
checks for identity (===)

```js
// pass
will(3).be(3);

// fail
will('3').be(3);
```

##### beDefined
checks to see if it's defined

```js
var foo = 123;
var bar;

// pass
will(foo).beDefined();

// fail
will(bar).beDefined();
```

##### beA/beAn
checks for inheritance (instanceof) *- These are synonyms.*

```js
// pass
will('').beA(String);
will([]).beAn(Array);

// fail
will('').beA(Number);
```

##### beLike
checks for equality (==)

```js
// pass
will('').beLike(false);

// fail
will('false').beLike(false);
```

##### eventually
checks result of a promise

```js
describe('some test suite', function () {
    it('should be less than 2', function () {
        var promise = Q.fcall(function () { return 2; });
        return will(promise).eventually.beLessThan(2);
    });
});
```

##### exist
checks existence

```js
// pass
var foo = { bar: 1 };

will(foo.bar).exist();

// fail
will(foo.baz).exist();
```

##### have
checks for items/properties in an Array/Object *- All must be present.*

```js
// pass
will([1, 2, 3]).have(1);
will([1, 2, 3]).have([1, 2]);
will({ foo: 1, bar: 1 }).have('foo');
will({ foo: 1, bar: 1 }).have(['foo', 'bar']);

// fail
will([2, 3]).have(1);
will([1, 2]).have([1, 3]);
will({ foo: 1, bar: 1 }).have('baz');
will({ foo: 1, bar: 1 }).have(['foo', 'baz']);
```

##### haveAny
checks for the existence of one item/property in an Array/Object

```js
// pass
will([1, 2, 3]).haveAny(1);
will([1, 2, 3]).haveAny([3, 6]);
will({ foo: 1, bar: 1 }).haveAny('foo');
will({ foo: 1, bar: 1 }).haveAny(['foo', 'baz']);

// fail
will([2, 3]).haveAny(1);
will([1, 2]).haveAny([3, 6]);
will({ foo: 1, bar: 1 }).haveAny('baz');
will({ foo: 1, bar: 1 }).haveAny(['baz', 'quux']);
```

##### haveOnly
checks Array/Object for unexpected items/properties

```js
// pass
will([1]).haveOnly(1);
will([1, 2, 3]).haveOnly([1, 2, 3]);
will({ foo: 1 }).haveOnly('foo');
will({ foo: 1, bar: 1 }).haveOnly(['foo', 'bar']);

// fail
will([1, 2]).haveOnly(1);
will([1, 2, 3]).haveOnly([1, 2]);
will({ foo: 1, bar: 1 }).haveOnly('baz');
will({ foo: 1, bar: 1, baz: 1 }).haveOnly(['foo', 'bar']);
```

##### haveOwn
checks for own properties (hasOwnProperty)

```js
var Foo = function () {};
var foo = new Foo();

foo.bar = true;
Foo.prototype.baz = true;

// pass
will(foo).haveOwn('bar');

// fail
will(foo).haveOwn('baz');
```

##### match
tests against RegExp

```js

// pass
will('asdf').match(/SD/i);

// fail
will('asdf').match(/SD/);
```

##### not
negates the logic of any assertion

```js
// pass
will(true).not.be(false);
will([1, 2]).not.haveOnly(1);

// fail
will('foo').not.be('foo');
will([1]).not.haveOnly(1);
```

##### throw
checks for errors being thrown

```js
var bad = function () {
    throw new Error('whoops');
};

var good = function () {};

// pass
will(bad).throw();

// fail
will(good).throw();
```

#### Utilities

##### addTest
add your own test to Willy

Add custom tests by passing a **named** function to `willy.addTest`.

* Return the result of `this.if` so Willy can automatically handle `not` and `eventually` for you.  `if` takes 3 arguments:
    * a function passed the value being tested
    * a string explaining what you were testing
    * the value tested (optional)

```js
var willy = require('willy'),
    will = willy.will;

willy.addTest(function beLessThan(expectedValue) {
    return this.if(

        // a function passed the value being tested
        function (actualValue) {

            // return the result of your test
            return actualValue < expectedValue;
        },

        // a string explaining what you were testing
        'be less than',

        // the value tested (optional)
        expectedValue
    );
});

// passes
will(1).beLessThan(2);

// fails
will(2).beLessThan(2); // 'expected <2> to be less than <2>'
will(1).not.beLessThan(2); // 'expected <1> not to be less than <2>'

// fails as a promise
describe('some test suite', function () {
    it('should be less than 2', function () {
        var promise = Q.fcall(function () { return 2; });
        return will(promise).eventually.beLessThan(2);
    });
});
```