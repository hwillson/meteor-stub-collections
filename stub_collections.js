import { _ } from 'meteor/underscore';
import { Mongo } from 'meteor/mongo';
import { sinon } from 'meteor/practicalmeteor:sinon';

const StubCollections = (() => {
  const publicApi = {};
  const privateApi = {};

  /* Public API */

  publicApi.add = (collections) => {
    privateApi.collections.push(...collections);
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
  privateApi.symbols = _.keys(Mongo.Collection.prototype);

  privateApi.stubPair = (pair) => {
    privateApi.symbols.forEach((symbol) => {
      if (_.isFunction(pair.localCollection[symbol]) && symbol != 'simpleSchema') {
        privateApi.sandbox.stub(
          pair.collection,
          symbol,
          _.bind(pair.localCollection[symbol], pair.localCollection)
        );
      }
    });
  };

  return publicApi;
})();

export default StubCollections;
