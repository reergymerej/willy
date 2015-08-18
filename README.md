[![Build Status](https://travis-ci.org/reergymerej/willy.svg?branch=master)](https://travis-ci.org/reergymerej/willy)

<a href="#installation">Installation</a> |
<a href="#built-in">Built-in Tests</a> |
<a href="#custom">Custom Tests</a>

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

Want to [add to Willy's repertoire](https://github.com/reergymerej/willy/wiki/Custom-Tests)?  That's easy, too.

```javascript
willy.define(function beASubstringOf() {
    return this.expected.indexOf(this.actual) > -1;
});

will('potato').beASubstringOf('Bender Bending Rodriguez');
// expected 'potato' to be a substring of 'Bender Bending Rodriguez'
```

<a name="installation"></a>
## Installation

Use [npm](https://www.npmjs.org/doc/README.html), man.  Keep it simple.

    npm install willy --save-dev


## Usage

<a name="built-in"></a>
### Built-in Tests

* <a href="#be">be</a>
* <a href="#beA">beA</a>
* <a href="#beAn">beAn</a>
* <a href="#beDefined">beDefined</a>
* <a href="#beFalsy">beFalsy</a>
* <a href="#beGreaterThan">beGreaterThan</a>
* <a href="#beLessThan">beLessThan</a>
* <a href="#beLike">beLike</a>
* <a href="#beMoreThan">beMoreThan</a>
* <a href="#beNull">beNull</a>
* <a href="#beTruthy">beTruthy</a>
* <a href="#beUndefined">beUndefined</a>
* <a href="#exist">exist</a>
* <a href="#have">have</a>
* <a href="#haveAny">haveAny</a>
* <a href="#haveOnly">haveOnly</a>
* <a href="#haveOwn">haveOwn</a>
* <a href="#match">match</a>
* <a href="#throw">throw</a>

<a name="be"></a>
##### be
Test [identity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Identity_.2F_strict_equality_(.3D.3D.3D)).

```js
// pass
will(3).be(3);

// fail
will('3').be(3);
```

<a name="beA"></a>
<a name="beAn"></a>
##### beA/beAn
Test inheritance.
This also handles some of the [weirdness of JavaScript](http://stackoverflow.com/questions/472418/why-is-4-not-an-instance-of-number), so that `String` and `Number` literals act as expected.

```js
var Foo = function () {};
var foo = new Foo();

// pass
will(foo).beA(Foo);
will('').beA(String);
will([]).beAn(Array);

// fail
will('').beA(Number);
```

<a name="beDefined"></a>
##### beDefined
Test for a defined value.

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
Test for a *falsy* value.

```js
// pass
will('').beFalsy();

// fail
will('asdf').beFalsy();
```

<a name="beGreaterThan"></a>
##### beGreaterThan
Test a value to see if it's greater than another.

```js
// pass
will(4).beGreaterThan(3);

// fail
will(3).beGreaterThan(3);
```

<a name="beLessThan"></a>
##### beLessThan
Test a value to see if it's less than another.

```js
// pass
will(3).beLessThan(4);

// fail
will(3).beLessThan(3);
```

<a name="beLike"></a>
##### beLike
Test [equality](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Equality_(.3D.3D)).

```js
// pass
will('').beLike(false);

// fail
will('false').beLike(false);
```

This also works on objects, including Arrays, recursively.
```js
// pass
will({
    foo: 'bar',
    baz: [1, 2, 3],
    quux: null
}).beLike({
    foo: 'bar',
    baz: [1, 2, 3],
    quux: null
});

will([1, 2, 3]).beLike([1, 2, 3]);

// fail
will({
    foo: {
        bar: {
            baz: {
                quux: true
            }
        }
    }
}).beLike({
    foo: {
        bar: {
            baz: {
                quux: false
            }
        }
    }
});

will([1, 2, 3]).beLike([3, 2, 1]);
```

<a name="beMoreThan"></a>
##### beMoreThan
Test a value to see if it's more than another.

```js
// pass
will(4).beMoreThan(3);

// fail
will(3).beMoreThan(3);
```

<a name="beNull"></a>
##### beNull
Test for `null`.

```js
// pass
will(null).beNull();

// fail
will(undefined).beNull();
```

<a name="beTruthy"></a>
##### beTruthy
Test for a *truthy* value.

```js
// pass
will('asdf').beTruthy();

// fail
will('').beTruthy();
```

<a name="beUndefined"></a>
##### beUndefined
Test for an `undefined` value.

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
Test the existence of a property.

```js
// pass
var foo = { bar: 1 };

will(foo.bar).exist();

// fail
will(foo.baz).exist();
```

<a name="have"></a>
##### have
Test the existence of multiple items/properties in an Array/Object.
*all must be present*

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
Test the existence of one item/property in an Array/Object

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
Test an Array/Object for unexpected items/properties.

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
Test for an [own property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty).

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
#### match
Test against RegExp.

```js

// pass
will('asdf').match(/SD/i);

// fail
will('asdf').match(/SD/);
```

<a name="throw"></a>
##### throw
Test for an error being thrown.

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

<a name="custom"></a>
### Custom Tests

To define new tests, use `willy.define`.  The function should return an [expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators) used to determine if the test passes or fails.

```js
willy.define(function beASubstringOf() {
    return this.expected.indexOf(this.actual) > -1;
});

will('potato').beASubstringOf('Bender Bending Rodriguez');
// expected 'potato' to be a substring of 'Bender Bending Rodriguez'
```

Inside every test function
* `this.actual` is the value passed to `will()`
* `this.expected` is the optional value passed to the test

#### Advanced

Pass an object to `willy.define` to give you more options.  The object's properties should be:

* **fn** - The function used to perform the test.
* **explanation** *(optional)* - An explanation of what you were testing.  If omitted, the test's name will be converted.
* **name** *(optional)* - The name of your test.  This can usually be figured out, but ocassionally you may want to be explicit.

**Changing the Explanation**

```js
// providing a better explanation
willy.define({
    fn: function beASubstringOf() {
        return this.expected.indexOf(this.actual) > -1;
    },
    explanation: 'be found inside of'
});

will('potato').beASubstringOf('Bender Bending Rodriguez');
// expected 'potato' to be found inside of 'Bender Bending Rodriguez'
```

**Changing the Name**

```js
// providing a different name
willy.define({
    fn: function () {
        return this.expected.indexOf(this.actual) > -1;
    },
    name: 'lieWithin'
});

will('potato').lieWithin('Bender Bending Rodriguez');
// expected 'potato' to lie within 'Bender Bending Rodriguez'
```

#### Bulk Definitions

If [you're lazy](http://threevirtues.com/), use `willy.loadDefinitions` to define multiple tests at a time.

```js
willy.loadDefinitions({
    beASubstringOf: {
        fn: function () {
            return this.expected.indexOf(this.actual) > -1;
        },
        explanation: 'be found inside of'
    },

    lieWithin: {
        fn: function () {
            return this.expected.indexOf(this.actual) > -1;
        }
    }
});
```

### Modularize It
For supreme laziness, keep your custom tests in a Node module.  This will allow you to build up a collection of custom tests you can reuse with all your projects.

**my-tests.js**

```js
exports.beASubstringOf = {
    fn: function () {
        return this.expected.indexOf(this.actual) > -1;
    },
    explanation: 'be found inside of'
};

exports.lieWithin = {
    fn: function () {
        return this.expected.indexOf(this.actual) > -1;
    }
};
```

**A Test Suite**

```js
var willy = require('willy'),
    will = willy.will;

willy.loadDefinitions(require('./my-tests.js'));

describe('a test suite', function () {
    it('should be pretty easy to share custom tests', function () {
        will('potato').lieWithin('Bender Bending Rodriguez');
        // expected 'potato' to lie within 'Bender Bending Rodriguez'
    });
});
```