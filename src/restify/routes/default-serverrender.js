'use strict';

import {serverRoute} from './api/list.js';
import {LIST_TYPES} from '../../lists/constants.js';
// UI Imports
import {h} from 'preact';
import render from 'preact-render-to-string';
// UI Components
import Routes from '../../routes.js';
import RoutedView from '../../core/routedView.js';
import LoadingView from '../../core/loadingView.js';
import ListViewWithData from '../../lists/list.js';

function defaultRoute(req, res, next) {
  const supportsManifest = req.userAgentClassifiction === 'chrome';
  const resources = req.resources;

  if (resources) {
    let linkHeaderValue = '';
    [resources.js, resources.route.js].forEach((preloadResource) => {
      linkHeaderValue += `<${preloadResource}>; rel=preload; as=script,`;
    });
    res.setHeader('Link', linkHeaderValue);
  }

  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Connection': 'Transfer-Encoding',
    'Transfer-Encoding': 'chunked',
    'Strict-Transport-Security': 'max-age=31557600; preload'
  });

  res.write(`<html>
    <head>
      <title>Preact Hacker News</title>
      <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0" />
      ${supportsManifest ? '<meta name="theme-color" content="#0077B5" />' : ''}
      <style>${resources.inline}</style>
      ${resources.inline === null && resources.css !== null ? `<link rel="stylesheet" href="${resources.css}" />` : ''}
      ${resources.route.css ? `<link rel="stylesheet" href="${resources.route.css}" />` : ''}
      ${supportsManifest ? '<link rel="manifest" href="dist/chrome/manifest.json" />' : ''}
      <link rel="icon" href="/static/icon/favicon.ico">
    </head>
    <body>
      <div id="mount">`);      

  let Route = <LoadingView />;
  let data = {};

  const listType = req.params.type ? LIST_TYPES[req.params.type] : req.url = '/' ? LIST_TYPES['top'] : null;
  if (listType) {
    data = serverRoute(req, {type: listType});
    Route = <ListViewWithData data={data} />;
  }

  const RoutedViewComponent = render(
    <RoutedView
      url={req.url}
      logger={req.log.info.bind(req.log)}
      delay={0}>
      {Route}
    </RoutedView>
  );
  /*
   * TODO: Move to use same router on server and client.
   * <Routes url={req.url} delay={0} child={<ListViewWithData data={serverRoute(req, {type: listType})} />} />
   */

  res.write(`
        ${RoutedViewComponent}
        </div>
        <script>window.seed=${JSON.stringify(data)};</script>
        <script src="${resources.js}"></script>
        <script src="${resources.route.js}"></script>
      </body>
    </html>`);

    // TODO: <script>window.seed=${JSON.stringify(data)};</script>
    // TODO: More research on why these scripts cannot be loaded async.

  res.end();

  next();
}

module.exports = defaultRoute;
