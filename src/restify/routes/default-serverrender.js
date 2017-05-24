'use strict';

import {serverRoute} from './api/list.js';
import {LIST_TYPES} from '../../lists/constants.js';
// UI Imports
import {h} from 'preact';
import render from 'preact-render-to-string';
// UI Components
import RoutedView from '../../core/routedView.js';
import LoadingView from '../../core/loadingView.js';
import ListViewWithData from '../../lists/list.js';

function defaultRoute(req, res, next) {
  const supportsManifest = req.userAgentClassifiction === 'chrome';
  const resources = req.resources;

  if (resources) {
    let linkHeaderValue = '';
    const toPush = resources.route && resources.route.js ? [resources.js, resources.route.js] : [resources.js];
    toPush.forEach((preloadResource) => {
      linkHeaderValue += `<${preloadResource}>; rel=preload; as=script,`;
    });
    res.setHeader('Link', linkHeaderValue);
  }

  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Connection': 'Transfer-Encoding',
    'Transfer-Encoding': 'chunked',
    'Strict-Transport-Security': 'max-age=31557600; includeSubDomains; preload',
    'Timing-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*'
  });

  let Route = <LoadingView />;
  let data = {};

  const listType = req.params.type ? LIST_TYPES[req.params.type] : req.url === '/' ? LIST_TYPES['top'] : null;
  if (listType) {
    data = serverRoute(req, {type: listType});
    Route = <ListViewWithData data={data} />;
  }

  res.write(`<!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Preact Hacker News</title>
      <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=5" />
      ${supportsManifest ? '<meta name="theme-color" content="#0077B5" />' : ''}
      ${resources.inline !== null ? `<style>${resources.inline}</style>` : resources.css !== null ? `<link rel="stylesheet" href="${resources.css}" />` : ''}
      ${supportsManifest ? '<link rel="manifest" href="/dist/chrome/manifest.json" />' : ''}
      <link rel="icon" href="/static/icons/favicon.png">
      <script>window.seed=${JSON.stringify(data)}</script>
      <script src='${resources.js}' defer></script>
      ${resources.route && resources.route.js ? `<script src='${resources.route.js}' defer></script>` : ''}
    </head>
    <body>`);

  const RoutedViewComponent = render(
    <RoutedView url={req.url} delay={0}>
      {Route}
    </RoutedView>
  );

  res.write(`
        ${RoutedViewComponent}
      </body>
    </html>`);

  res.end();

  next();
}

module.exports = defaultRoute;
