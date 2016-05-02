import { _ } from 'meteor/underscore';
import { Mongo } from 'meteor/mongo';
import { sinon } from 'meteor/practicalmeteor:sinon';

const StubCollections = (() => {
  const _public = {};
  const _private = {};

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
    _.each(_private.pairs, _private.restorePair);
    _private.pairs = {};
  };

  _private.pairs = {};
  _private.collections = [];
  _private.symbols = _.keys(Mongo.Collection.prototype);

  _private.stubPair = (pair) => {
    _private.symbols.forEach((symbol) => {
      sinon.stub(
        pair.collection,
        symbol,
        _.bind(pair.localCollection[symbol], pair.localCollection)
      );
    });
  };

  _private.restorePair = (pair) => {
    _private.symbols.forEach((symbol) => {
      pair.collection[symbol].restore();
    });
  };

  return _public;
})();

export default StubCollections;
