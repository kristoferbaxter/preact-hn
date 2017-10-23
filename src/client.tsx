import {h, render} from 'preact';
import 'utils/memory';
import {storeList} from 'api/list';

import Router from 'components/Router';
import RoutedView from './core/routedView';
import List from 'routes/List';

import './reset.css';

if (POLYFILL_OBJECT_ASSIGN) {
  // This is supplied by WebpackConfiguration.
  require('object-assign-polyfill');
}
if (POLYFILL_OBJECT_VALUES) {
  // This is supplied by WebpackConfiguration.
  require('object.values').shim();
}
if (POLYFILL_PROMISES) {
  // This is supplied by WebpackConfiguration.
  // (window as any)['Promise'] = require('promise-polyfill');
  (window as any)['Promise'] = require('promise-polyfill');
}
if (POLYFILL_FETCH) {
  // This is supplied by WebpackConfiguration.
  require('unfetch/polyfill');
}
if (POLYFILL_URL) {
  require('url-polyfill');
}

(window as any).seed && storeList((window as any).seed);
const mountEl = document.getElementById('mount');
render(
  <Router>
    <RoutedView path="/top/:page" default type="top" child={List} delay={0} />
    <RoutedView path="/new/:page" type="new" child={List} delay={0} />
    <RoutedView path="/show/:page" type="show" child={List} delay={0} />
    <RoutedView path="/ask/:page" type="ask" child={List} delay={0} />
    <RoutedView path="/jobs/:page" type="job" child={List} delay={0} />
    <RoutedView path="/about" load={require('bundle-loader?lazy&name=AboutHome!./routes/About')} />
    <RoutedView path="/item/:id" load={require('bundle-loader?lazy&name=ItemHome!./routes/Item')} />
    <RoutedView path="/user/:id" load={require('bundle-loader?lazy&name=UserHome!./routes/User')} />
  </Router>,
  mountEl.parentNode as Element,
  mountEl,
);

if (ALLOW_OFFLINE) {
  navigator.serviceWorker.register('/service-worker.js');
}
