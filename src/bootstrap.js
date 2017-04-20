if (POLYFILL_OBJECT_ASSIGN) {
  require('object-assign-polyfill');
}
if (POLYFILL_OBJECT_VALUES) {
  require('object.values').shim();
}
if (POLYFILL_PROMISES) {
  // This is supplied by WebpackConfiguration.
  window.Promise = require('promise-polyfill');
}
if (POLYFILL_FETCH) {
  // This is supplied by WebpackConfiguration.
  require('unfetch/polyfill');
}
if (POLYFILL_URL) {
  require('url-polyfill');
}

require('./client.js');