/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback, no-unused-expressions */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { expect } from 'chai';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import StubCollections from './index';

const widgets = new Mongo.Collection('widgets');
const schema = { schemaKey: { type: String, optional: true } };
widgets.attachSchema(new SimpleSchema(schema));
if (Meteor.isServer) {
  widgets.remove({});
  widgets.insert({});
  Meteor.publish('widgets', function allWidgets() {
    return widgets.find();
  });
} else {
  Meteor.subscribe('widgets');
}

describe('StubCollections', function () {
  it('should stub added/registered collections', function () {
    expect(widgets.find().count()).to.equal(1);

    StubCollections.add([widgets]);
    StubCollections.stub();
    expect(widgets.find().count()).to.equal(0);

    widgets.insert({});
    widgets.insert({});
    expect(widgets.find().count()).to.equal(2);

    StubCollections.restore();
    expect(widgets.find().count()).to.equal(1);
  });

  it('should stub non-registered one-off collections', function () {
    expect(widgets.find().count()).to.equal(1);

    StubCollections.stub([widgets]);
    expect(widgets.find().count()).to.equal(0);

    widgets.insert({});
    widgets.insert({});
    expect(widgets.find().count()).to.equal(2);

    StubCollections.restore();
    expect(widgets.find().count()).to.equal(1);
  });

  it('should stub the schema of a collection', function () {
    expect(widgets.simpleSchema()._firstLevelSchemaKeys).to.include('schemaKey');
    StubCollections.stub([widgets]);
    expect(widgets.simpleSchema()._firstLevelSchemaKeys).to.include('schemaKey');
    StubCollections.restore();
    expect(widgets.simpleSchema()._firstLevelSchemaKeys).to.include('schemaKey');
  });
});
