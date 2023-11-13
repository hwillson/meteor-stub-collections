import { extend } from 'lodash';
import { Mongo } from 'meteor/mongo';

interface Document extends Object {}

interface IStubCollections {
  add: <T extends Document>(collections: Mongo.Collection<T>[]) => void;
  stub: <T extends Document>(collections?: Mongo.Collection<T>[]) => void;
  restore: () => void;
}

declare const StubCollections: IStubCollections;

export default StubCollections;