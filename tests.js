/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback, no-unused-expressions */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { expect } from 'chai';
import SimpleSchema from 'simpl-schema';
import StubCollections from './index';

const widgets = new Mongo.Collection('widgets');
const localWidgets1 = new Mongo.Collection(null);
const localWidgets2 = new Mongo.Collection(null);

const schema = { schemaKey: { type: String, optional: true } };
const options = {
  clean: {
    autoConvert: false,
    filter: false,
    getAutoValues: false,
    removeEmptyStrings: false,
    removeNullsFromArrays: false,
    trimStrings: false
  },
  humanizeAutoLabels: false,
  requiredByDefault: true
};
widgets.attachSchema(new SimpleSchema(schema, options));
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

  it('should be compatible with collection2', function () {
    StubCollections.stub([widgets]);
    expect(() => widgets.insert({ foo: 'bar' }))
      .to.throw('foo is not allowed by the schema in widgets insert');
    StubCollections.restore();
  });
  
  it("should stub mutliple null collections", function() {
    localWidgets1.insert({});
    localWidgets2.insert({});
    localWidgets2.insert({});

    expect(localWidgets1.find().count()).to.equal(1);
    expect(localWidgets2.find().count()).to.equal(2);

    StubCollections.stub([localWidgets1, localWidgets2]);

    expect(localWidgets1.find().count()).to.equal(0);
    expect(localWidgets2.find().count()).to.equal(0);

    localWidgets1.insert({});
    localWidgets1.insert({});
    localWidgets2.insert({});
    
    expect(localWidgets1.find().count()).to.equal(2);
    expect(localWidgets2.find().count()).to.equal(1);
    
    StubCollections.restore();

    expect(localWidgets1.find().count()).to.equal(1);
    expect(localWidgets2.find().count()).to.equal(2);

    StubCollections.stub([localWidgets1, localWidgets2]);

    localWidgets1.insert({});
    localWidgets2.insert({});
    localWidgets2.insert({});

    expect(localWidgets1.find().count()).to.equal(1);
    expect(localWidgets2.find().count()).to.equal(2);

    StubCollections.restore();
    
    expect(localWidgets1.find().count()).to.equal(1);
    expect(localWidgets2.find().count()).to.equal(2);
  });
});
