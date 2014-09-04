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

Use npm, man.  Keep it simple.

    npm install willy --save-dev


### API

**Built-in Tests**
* [be](#be)
* [beA/beAn](#beA-beAn)
* [beDefined](#beDefined)
* [beFalsy](#beFalsy)
* [beGreaterThan](#beGreaterThan)
* [beLessThan](#beLessThan)
* [beLike](#beLike)
* [beNull](#beNull)
* [beTruthy](#beTruthy)
* [beUndefined](#beUndefined)
* [exist](#exist)
* [have](#have)
* [haveAny](#haveAny)
* [haveOnly](#haveOnly)
* [haveOwn](#haveOwn)
* [match](#match)
* [throw](#throw)

**Custom Tests**
* [addTest](#addTest)

**Modifiers**
* [eventually](#eventually)
* [not](#not)

---

#### Built-in Tests

<a name="be"></a>
##### be 
checks for identity (===)

```js
// pass
will(3).be(3);

// fail
will('3').be(3);
```

<a name="beA-beAn"></a>
##### beA/beAn
checks for inheritance (instanceof) *- These are synonyms.*

```js
// pass
will('').beA(String);
will([]).beAn(Array);

// fail
will('').beA(Number);
```

<a name="beDefined"></a>
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

<a name="beFalsy"></a>
##### beFalsy
checks for a *falsy* value

```js
// pass
will('').beFalsy();

// fail
will('asdf').beFalsy();
```

<a name="beGreaterThan"></a>
##### beGreaterThan
checks to see if a value is greater than expected

```js
// pass
will(4).beGreaterThan(3);

// fail
will(3).beGreaterThan(3);
```

<a name="beLessThan"></a>
##### beLessThan
checks to see if a value is less than expected

```js
// pass
will(3).beLessThan(4);

// fail
will(3).beLessThan(3);
```

<a name="beLike"></a>
##### beLike
checks for equality (==)

```js
// pass
will('').beLike(false);

// fail
will('false').beLike(false);
```

<a name="beNull"></a>
##### beNull
checks for `null`

```js
// pass
will(null).beNull();

// fail
will(undefined).beNull();
```

<a name="beTruthy"></a>
##### beTruthy
checks for a *truthy* value

```js
// pass
will('asdf').beTruthy();

// fail
will('').beTruthy();
```

<a name="beUndefined"></a>
##### beUndefined
checks to see if it's `undefined`

```js
var foo;
var bar = 123;

// pass
will(foo).beUndefined();

// fail
will(bar).beUndefined();
```

<a name="exist"></a>
##### exist
checks existence

```js
// pass
var foo = { bar: 1 };

will(foo.bar).exist();

// fail
will(foo.baz).exist();
```

<a name="have"></a>
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

<a name="haveAny"></a>
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

<a name="haveOnly"></a>
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

<a name="haveOwn"></a>
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

<a name="match"></a>
##### match
tests against RegExp

```js

// pass
will('asdf').match(/SD/i);

// fail
will('asdf').match(/SD/);
```

<a name="throw"></a>
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


#### Custom Tests

<a name="addTest"></a>
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

willy.addTest(function beLongerThan(expectedValue) {
    return this.if(

        // a function passed the value being tested
        function (actualValue) {

            // return the result of your test
            return actualValue.length > expectedValue.length;
        },

        // a string explaining what you were testing
        'be longer than',

        // the value tested (optional)
        expectedValue
    );
});

// passes
will('12345').beLongerThan('123');

// fails
will('12345').beLongerThan('12345'); // 'expected <12345> to be longer than <12345>'
will('12345').not.beLongerThan('1234'); // 'expected <12345> not to be longer than <1234>'

// fails as a promise
describe('some test suite', function () {
    it('should be longer than expected', function () {
        var promise = Q.fcall(function () { return '123'; });
        return will(promise).eventually.beLongerThan('12345');
    });
});
```


#### Modifiers

<a name="eventually"></a>
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

<a name="not"></a>
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
