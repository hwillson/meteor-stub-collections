import { _ } from 'meteor/underscore';
import { Mongo } from 'meteor/mongo';
import { sinon } from 'meteor/practicalmeteor:sinon';

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
  privateApi.symbols = [];
  for (let symbol in Mongo.Collection.prototype) {
    privateApi.symbols.push(symbol);
  }


  privateApi.assignLocalFunctionsToReal = (local, real) => {
    privateApi.symbols.forEach((symbol) => {
      if (symbol === 'simpleSchema') return;
      if (!_.isFunction(local[symbol])) return;
      if (!_.isFunction(real[symbol])) return;
      // replace all collection functions w/ local collection functions
      privateApi.sandbox.stub(real, symbol, _.bind(local[symbol], local));
    });
  };

  privateApi.stubPair = (pair) => {
    privateApi.assignLocalFunctionsToReal(pair.localCollection, pair.collection);
    if (pair.collection.direct) {
      // the real collection has hooks applied - we need to localify the direct functions too
      privateApi.assignLocalFunctionsToReal(pair.localCollection, pair.collection.direct);
    }
  };

  return publicApi;
})();

export default StubCollections;
