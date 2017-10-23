// UI Imports
import {h} from 'preact';
import {render} from 'preact-render-to-string';
// UI Components
import RoutedView from '../../core/routedView';
import Loading from 'components/Loading';
import List from 'components/List';

import {serverRoute} from '@kristoferbaxter/hn-api/lib/routes/list';

export default async function defaultRoute(req, res, next): Promise<void> {
  const supportsManifest = req.userAgentClassifiction === 'chrome';
  const resources = req.resources;

  if (resources) {
    let linkHeaderValue = '';
    const toPush = resources.route && resources.route.js ? [resources.js, resources.route.js] : [resources.js];
    toPush.forEach(preloadResource => {
      linkHeaderValue += `<${preloadResource}>; rel=preload; as=script,`;
    });
    res.setHeader('Link', linkHeaderValue);
  }

  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    Connection: 'Transfer-Encoding',
    'Transfer-Encoding': 'chunked',
    'Strict-Transport-Security': 'max-age=31557600; includeSubDomains; preload',
    'Timing-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
  });

  let data = {};
  const listType = (req.url === '/' && 'top') || req.params.type || null;
  if (listType) {
    data = await serverRoute(req, {type: listType});
  }

  res.write(`<!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Preact Hacker News</title>
      <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=5" />
      ${supportsManifest ? '<meta name="theme-color" content="#0077B5" />' : ''}
      ${resources.inline !== null
        ? `<style>${resources.inline}</style>`
        : resources.css !== null ? `<link rel="stylesheet" href="${resources.css}" />` : ''}
      ${supportsManifest ? '<link rel="manifest" href="/dist/chrome/manifest.json" />' : ''}
      <link rel="icon" href="/static/icons/favicon.png">
      <script>window.seed=${JSON.stringify(data)}</script>
      <script src='${resources.js}' defer></script>
      ${resources.route && resources.route.js ? `<script src='${resources.route.js}' defer></script>` : ''}
    </head>
    <body>`);

  const RoutedViewComponent: string = render(
    <RoutedView url={req.url} delay={0} child={listType ? List : Loading} data={data} />,
  );

  res.write(`
        ${RoutedViewComponent}
      </body>
    </html>`);

  res.end();

  next();
}
