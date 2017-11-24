/* global Package, Npm */
/* eslint-disable prefer-arrow-callback */

Package.describe({
  name: 'hwillson:stub-collections',
  version: '1.0.6',
  summary: 'Stub out Meteor collections with in-memory local collections.',
  documentation: 'README.md',
  git: 'https://github.com/hwillson/meteor-stub-collections.git',
  debugOnly: true,
});

Npm.depends({
  chai: '4.1.2',
  sinon: '4.1.2',
});

Package.onUse(function onUse(api) {
  api.versionsFrom('1.3');
  api.use([
    'ecmascript',
    'mongo',
  ]);
  api.mainModule('index.js');
});

Package.onTest(function onTest(api) {
  api.use([
    'hwillson:stub-collections',
    'aldeed:simple-schema@1.5.3',
    'aldeed:collection2@2.10.0',
    'ecmascript',
    'mongo',
    'meteortesting:mocha@0.5.0',
  ]);
  api.mainModule('tests.js');
});
