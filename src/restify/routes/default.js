'use strict';

// UI Imports
import {h} from 'preact';
import render from 'preact-render-to-string';
// UI Components
import RoutedView from '../../core/routedView.js';
import LoadingView from '../../core/loadingView.js';

function defaultRoute(req, res, next) {
  req.log.warn(req.url);
  
  const supportsManifest = req.userAgentClassifiction === 'chrome';
  const resources = req.resources;

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
      ${resources.inline === null && resources.css !== null ? '<link rel="stylesheet" href="' + resources.css + '" />' : ''}
      ${supportsManifest ? '<link rel="manifest" href="dist/chrome/manifest.json" />' : ''}
      ${resources['service.worker'] ? '<meta name="config.serviceworker" id="config.serviceworker" content="/' + resources['service.worker'] + '" />' : ''}
      <link rel="icon" href="/static/icon/favicon.ico">
      <script src="${resources.js}" async></script>
    </head>
    <body>
      <div id="mount">`);

 // TODO: <script src="${resources.route.js}" async></script> in head, solve.
 // <img src="${resources.route.js}" style="width:1;height:1;position:absolute;top:0;left:0" />
  const RoutedViewComponent = render(
    <RoutedView
      url={req.url}
      logger={req.log.info.bind(req.log)}
      delay={0}>
      <LoadingView />
    </RoutedView>
  );

  res.write(`
        ${RoutedViewComponent}
        </div>
      </body>
    </html>`);

  res.end();

  next();
}

module.exports = defaultRoute;
