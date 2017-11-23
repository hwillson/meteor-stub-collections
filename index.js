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
        const pair = {
          localCollection: new collection.constructor(null, options),
          collection,
        };
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

  privateApi.stubPair = (pair) => {
    privateApi.symbols.forEach((symbol) => {
      if (typeof pair.localCollection[symbol] === 'function'
          && symbol !== 'simpleSchema') {
        privateApi.sandbox.stub(pair.collection, symbol).callsFake(
          pair.localCollection[symbol].bind(pair.localCollection),
        );
      }
    });
  };

  return publicApi;
})();

export default StubCollections;
