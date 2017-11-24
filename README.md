# Meteor - Stub Collections

## Intro

Easily stub out Meteor collections with in-memory local collections. The idea here is to allow the use of things like Factories for unit tests and styleguides without having to restrict ourselves to making components "pure". So a component (ie. a template) can still call `Widgets.findOne(widgetId)`, it's just that we will have stubbed out `Widgets` to point to a local collection that we can completely control in our test.

## Installation

```
meteor add hwillson:stub-collections
```

### Usage via ES6 import

```js
// client or server
import StubCollections from 'meteor/hwillson:stub-collections';
```

## API

- `StubCollections.add([collection1, collection2, ...])` - register the default list of collections to stub.
- `StubCollections.stub()` - stub all collections that have been previously enabled for stubbing via `add()`.
- `StubCollections.stub([collection1, collection2, ...])` - stub a specific list of collections, overriding the list registered via `add()`.
- `StubCollections.restore()` - undo stubbing (call at the end of tests, on routing away, etc.)

## Examples

See this packages [tests](https://github.com/hwillson/meteor-stub-collections/blob/3a0ac26121d8e864cd5b78959b0edb7b9532c761/stub_collections.tests.js).

## History

This project was originally created by MDG, and shipped with the [Meteor Guide's](http://guide.meteor.com) [todos](https://github.com/meteor/todos) reference application (thanks MDG!). If you have any questions/comments, open an issue [here](https://github.com/hwillson/meteor-stub-collections/issues).

### 1.0.6 (2017-11-24)

- Proper fix for issue [#22](reported in https://github.com/hwillson/meteor-stub-collections/issues/22)

### 1.0.5 (2017-11-24)

- Re-publish to deal with issue [#22](reported in https://github.com/hwillson/meteor-stub-collections/issues/22)

### 1.0.4 (2017-11-23)

- Fix for [issue #11](https://github.com/hwillson/meteor-stub-collections/issues/11) (again) where [CollectionHooks](https://github.com/matb33/meteor-collection-hooks/) Collections `direct` accessors were not properly stubbed (thanks [@zeroasterisk](https://github.com/zeroasterisk)!).
- Allow single collections with `add` ([PR #18](https://github.com/hwillson/meteor-stub-collections/pull/18) - thanks [@Floriferous](https://github.com/Floriferous)!).
- Removed `underscore`
- Replaced `practicalmeteor:mocha` with `meteortesting:mocha`
- Switched to npm based `sinon` and `chai` packages
- Slight refactoring based on linting
- Test cleanup

### 1.0.3

- Fixes [issue #11](https://github.com/hwillson/meteor-stub-collections/issues/11) where some inherited Collection properties were not properly stubbed (thanks [@Davidyuk](https://github.com/Davidyuk)!).

### 1.0.2

- Omit the stubbing of a collection's schema if using aldeed:collection2 package (thanks [@drewmoore](https://github.com/drewmoore)!).

### 1.0.1

- Fixed bind issues with non-functions (thanks [@Fabs](https://github.com/Fabs)!).
- Better leveraging of the [Sinon](http://sinonjs.org) sandbox (thanks [@Fabs](https://github.com/Fabs)!)
