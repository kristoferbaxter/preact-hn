import {h, render} from 'preact';
import {Routes, ROUTE_BUNDLE} from './routes.js';
import {MemoryStore} from './core/api/memory.js';
import {setLatestUUID} from './core/api/list.js';

import './reset.css';

function clientStart() {
  const mountEl = document.getElementById('mount');
  render(<Routes />, mountEl.parentNode, mountEl);

  if (ALLOW_OFFLINE) {
    // This is supplied by WebpackConfiguration.
    require('offline-plugin/runtime').install();
  }
}

if (window.seed !== undefined) {
  // When window seed is present.
  // 1. We are booting the application fresh from network.
  // 2. The first data response is inline in the document as the 'seed'

  const {uuid, items, $entities, max, type, route} = window.seed;

  MemoryStore({
    [uuid]: {
      items,
      max,
      type
    }
  });
  MemoryStore($entities);
  setLatestUUID(type, uuid);

  if (route !== undefined) {
    ROUTE_BUNDLE[route]((file) => {
      clientStart();
    }); 
  } else {
    clientStart();
  }
} else {
  clientStart(); 
}