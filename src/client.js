import {h, render} from 'preact';
import Routes from './routes.js';

import './core/api/memory.js';
import './core/api/boot.js';
import './reset.css';

const mountEl = document.getElementById('mount');
render(<Routes />, mountEl.parentNode, mountEl);

if (ALLOW_OFFLINE) {
  // This is supplied by WebpackConfiguration.
  require('offline-plugin/runtime').install();
}