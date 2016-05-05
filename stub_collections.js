import { _ } from 'meteor/underscore';
import { Mongo } from 'meteor/mongo';
import { sinon } from 'meteor/practicalmeteor:sinon';

const StubCollections = (() => {
  const _public = {};
  const _private = {};
  const sandbox = sinon.sandbox.create();

  _public.add = (collections) => {
    _private.collections.push(...collections);
  };

  _public.stub = (collections) => {
    const pendingCollections = collections || _private.collections;
    [].concat(pendingCollections).forEach((collection) => {
      if (!_private.pairs[collection._name]) {
        const options = {
          transform: collection._transform,
        };
        const pair = {
          localCollection: new collection.constructor(null, options),
          collection,
        };
        _private.stubPair(pair);
        _private.pairs[collection._name] = pair;
      }
    });
  };

  _public.restore = () => {
    sandbox.restore();
    _private.pairs = {};
  };

  _private.pairs = {};
  _private.collections = [];
  _private.symbols = _.keys(Mongo.Collection.prototype);

  _private.stubPair = (pair) => {
    _private.symbols.forEach((symbol) => {
      if (_.isFunction(pair.localCollection[symbol])) {
        sandbox.stub(
          pair.collection,
          symbol,
          _.bind(pair.localCollection[symbol], pair.localCollection)
        );
      }
    });
  };

  return _public;
})();

export default StubCollections;
