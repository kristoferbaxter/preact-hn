import {h, render} from 'preact';
import Routes from './routes.js';

import './core/api/memory.js';
import './core/api/boot.js';
if (POLYFILL_PROMISES) {
  // This is supplied by WebpackConfiguration.
  window.Promise = require('promise-polyfill');
}
if (POLYFILL_FETCH) {
  // This is supplied by WebpackConfiguration.
  require('unfetch/polyfill');
}
import './reset.css';

render(<Routes />, null, document.getElementById('mount'));

if (ALLOW_OFFLINE) {
  // This is supplied by WebpackConfiguration.
  require('offline-plugin/runtime').install();
}