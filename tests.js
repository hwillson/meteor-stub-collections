/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback, no-unused-expressions */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { expect } from 'chai';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import StubCollections from './index';

const widgets = new Mongo.Collection('widgets');
const localWidgets1 = new Mongo.Collection(null);
const localWidgets2 = new Mongo.Collection(null);

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
  
  it("should stub mutliple null collections", function() {
    localWidgets1.insert({});
    localWidgets2.insert({});

    expect(localWidgets1.find().count()).to.equal(1);
    expect(localWidgets2.find().count()).to.equal(1);

    StubCollections.stub([localWidgets1, localWidgets2]);

    expect(localWidgets1.find().count()).to.equal(0);
    expect(localWidgets2.find().count()).to.equal(0);

    localWidgets1.insert({});
    localWidgets1.insert({});
    localWidgets2.insert({});
    localWidgets2.insert({});
    
    expect(localWidgets1.find().count()).to.equal(2);
    expect(localWidgets2.find().count()).to.equal(2);
    
    StubCollections.restore();

    expect(localWidgets1.find().count()).to.equal(1);
    expect(localWidgets2.find().count()).to.equal(1);

    StubCollections.stub([localWidgets1, localWidgets2]);

    localWidgets1.insert({});
    localWidgets2.insert({});

    expect(localWidgets1.find().count()).to.equal(1);
    expect(localWidgets2.find().count()).to.equal(1);
  });
});
