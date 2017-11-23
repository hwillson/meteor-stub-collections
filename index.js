import { Mongo } from 'meteor/mongo';
import sinon from 'sinon';

const StubCollections = (() => {
  const publicApi = {};
  const privateApi = {};

  /* Public API */

  publicApi.add = (collections) => {
    privateApi.collections = privateApi.collections.concat(collections);
  };

  publicApi.stub = (collections) => {
    const pendingCollections = collections || privateApi.collections;
    [].concat(pendingCollections).forEach((collection) => {
      if (!privateApi.pairs[collection._name]) {
        const options = {
          transform: collection._transform,
        };
        const localCollection = new collection.constructor(null, options);
        const pair = { localCollection, collection };
        privateApi.stubPair(pair);
        privateApi.pairs[collection._name] = pair;
      }
    });
  };

  publicApi.restore = () => {
    privateApi.sandbox.restore();
    privateApi.pairs = {};
  };

  /* Private API */

  privateApi.sandbox = sinon.sandbox.create();
  privateApi.pairs = {};
  privateApi.collections = [];
  privateApi.symbols = Object.keys(Mongo.Collection.prototype);

  privateApi.assignLocalFunctionsToReal = (local, real) => {
    privateApi.symbols.forEach((symbol) => {
      if (symbol === 'simpleSchema') return;
      if (typeof local[symbol] !== 'function') return;
      if (typeof real[symbol] !== 'function') return;
      privateApi.sandbox.stub(real, symbol).callsFake(
        local[symbol].bind(local),
      );
    });
  };

  privateApi.stubPair = (pair) => {
    privateApi.assignLocalFunctionsToReal(
      pair.localCollection,
      pair.collection,
    );
    // If using `matb33:collection-hooks`, make sure direct functions are also
    // stubbed.
    if (pair.collection.direct) {
      privateApi.assignLocalFunctionsToReal(
        pair.localCollection,
        pair.collection.direct,
      );
    }
  };

  return publicApi;
})();

export default StubCollections;
