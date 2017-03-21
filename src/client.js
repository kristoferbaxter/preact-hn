import {h, render} from 'preact';
import Routes from './routes.js';

import './core/api/memory.js';
import './reset.css';

render(<Routes />, null, document.getElementById('mount'));
require('offline-plugin/runtime').install();