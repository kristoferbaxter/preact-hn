import restify from 'restify';
import bunyan from 'bunyan';
import WebpackResources from './resources';
import {init as ForegroundDataInit} from '@kristoferbaxter/hn-api/lib/storage/foreground';

// Restify Plugins
import classifyBrowser from './plugins/classifyBrowser';
import setRequestResources from './plugins/setRequestResources';

// Routes
import {route as apiListRoute} from '@kristoferbaxter/hn-api/lib/routes/list';
import {route as apiDetailsRoute} from '@kristoferbaxter/hn-api/lib/routes/details';
import insecureRedirect from './routes/insecure';
import defaultRoute from './routes/default-serverrender';
import shellRoute from './routes/default';
import staticRoute from './routes/static';
import staticIconRoute from './routes/static-icons';
import serviceWorkerRoute from './routes/service-worker';

// Server Constants
const APPLICATION_NAME = 'hn-web';
const logger = bunyan.createLogger({
  name: APPLICATION_NAME,
});

const server = restify.createServer({
  name: APPLICATION_NAME,
  log: logger,
});
server.use(restify.requestLogger());
server.use(restify.bodyParser());
server.use(restify.queryParser());
server.use(classifyBrowser());
server.use(setRequestResources(WebpackResources(logger)));

// TODO: Do not duplicate route definitions...
// Programatically derive from a single source of truth.
server.get('/api/list/:type', apiListRoute);
server.get('/api/details/:id', apiDetailsRoute);
server.get('/item/:id', insecureRedirect, defaultRoute);
server.get('/shell', shellRoute);
server.get('/dist/:classification/:file', staticRoute);
server.get('/static/icons/:file', staticIconRoute);
server.get('/service-worker.js', serviceWorkerRoute);
server.get('/.*', insecureRedirect, defaultRoute);

// Prefetch Data for API.
ForegroundDataInit('dist/server/restify.background.js');

server.listen(22164, function() {
  console.log('%s listening at %s', server.name, server.url);
});

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
