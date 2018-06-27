/* global Package, Npm */
/* eslint-disable prefer-arrow-callback */

Package.describe({
  name: 'hwillson:stub-collections',
  version: '1.0.9',
  summary: 'Stub out Meteor collections with in-memory local collections.',
  documentation: 'README.md',
  git: 'https://github.com/hwillson/meteor-stub-collections.git',
  debugOnly: true,
});

Npm.depends({
  chai: '4.1.2',
  sinon: '6.0.1',
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
    'lmieulet:meteor-coverage@2.0.2', // Needed until https://github.com/meteortesting/meteor-mocha/pull/69 is merged
    'meteortesting:mocha@1.0.0',
  ]);
  api.mainModule('tests.js');
});
