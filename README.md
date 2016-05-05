# Meteor - Stub Collections

## Intro

Easily stub out Meteor collections with in-memory local collections. The idea here is to allow the use of things like Factories for unit tests and styleguides without having to restrict ourselves to making components "pure". So a component (ie. a template) can still call `Widgets.findOne(widgetId)`, it's just that we will have stubbed out `Widgets` to point to a local collection that we can completely control in our test.

## Installation

```
meteor add hwillson:stub-collections
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

### 1.0.1

- Fixed bind issues with non-functions (thanks [@Fabs](https://github.com/Fabs)!).
- Better leveraging of the [Sinon](http://sinonjs.org) sandbox (thanks [@Fabs](https://github.com/Fabs)!)
