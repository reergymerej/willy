# Willy

Willy is an assertion library designed to be simple and readable.  It doesn't follow the normal BDD/TDD assertion styles, but reads more like questions.

```js
describe('some test suite', function () {
    it('should do X, Y, and Z', function () {

        // Will it?
        will(true).be(true);

    });
});
```

## API

### Index

* be
* beA/beAn
* beLike
* have
* haveAny
* haveOnly
* haveOwn
* not
* throw

#### be 
checks for identity (===)

```js
// pass
will(3).be(3);

// fail
will('3').be(3);
```

#### beA/beAn
checks for inheritance (instanceof) *- These are synonyms.*

```js
// pass
will('').beA(String);
will([]).beAn(Array);

// fail
will('').beA(Number);
```

#### beLike
checks for equality (==)

```js
// pass
will('').beLike(false);

// fail
will('false').beLike(false);
```

#### have
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

#### haveAny
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

#### haveOnly
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

#### haveOwn
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

#### not
negates the logic of any assertion

```js
// pass
will(true).not.be(false);
will([1, 2]).not.haveOnly(1);

// fail
will('foo').not.be('foo');
will([1]).not.haveOnly(1);
```

#### throw
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
