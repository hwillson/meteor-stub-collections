/* global Package */
/* eslint-disable prefer-arrow-callback */

Package.describe({
  name: 'hwillson:stub-collections',
  version: '1.0.4',
  summary: 'Stub out Meteor collections with in-memory local collections.',
  documentation: 'README.md',
  git: 'https://github.com/hwillson/meteor-stub-collections.git',
  debugOnly: true,
});

Package.onUse(function onUse(api) {
  api.versionsFrom('1.3');
  api.use([
    'ecmascript',
    'mongo',
    'practicalmeteor:sinon@1.14.1_2',
    'underscore',
  ]);
  api.mainModule('stub_collections.js');
});

Package.onTest(function onTest(api) {
  api.use('hwillson:stub-collections');
  api.use('aldeed:collection2@2.10.0');
  api.use(['ecmascript', 'mongo', 'practicalmeteor:chai']);
  api.mainModule('stub_collections.tests.js');
});
