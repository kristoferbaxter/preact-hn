const restify = require('restify');
const bunyan = require('bunyan');
const WebpackResources = require('./resources.js');
const ForegroundData = require('./storage/foreground.js');

// Restify Plugins
const classifyBrowser = require('./plugins/classifyBrowser.js');
const setRequestResources = require('./plugins/setRequestResources.js');
const shrinkRay = require('shrink-ray');

// Routes
const apiList = require('./routes/api/list.js');
const apiItems = require('./routes/api/items.js');
const apiComments = require('./routes/api/comments.js');
const insecureRedirect = require('./routes/insecure.js');
const defaultRoute = require('./routes/default-serverrender.js');
const shellRoute = require('./routes/default.js');
const staticRoute = require('./routes/static.js');
const staticIconRoute = require('./routes/static-icons.js');
const serviceWorkerRoute = require('./routes/serviceWorker.js');

// Server Constants
const APPLICATION_NAME = 'hn-web';
const logger = bunyan.createLogger({
  name: APPLICATION_NAME
});

const server = restify.createServer({
  name: APPLICATION_NAME,
  log: logger
});
server.use(restify.requestLogger());
server.use(restify.bodyParser());
server.use(restify.queryParser());
server.use(shrinkRay({filter: function(req) {
  return !/.js|.css/.test(req.url);
}}));
server.use(classifyBrowser());
server.use(setRequestResources(WebpackResources(logger)));

// TODO: Do not duplicate route definitions...
// Programatically derive from a single source of truth.
server.get('/api/list/:type', apiList.route);
server.get('/api/items', apiItems.route);
server.get('/api/comments/:id', apiComments.route);
server.get('/:type/:id', insecureRedirect, defaultRoute);
server.get('/shell', shellRoute);
server.get('/dist/:classification/:file', staticRoute);
server.get('/static/icons/:file', staticIconRoute);
server.get('/sw.js', serviceWorkerRoute);
server.get('/.*', insecureRedirect, defaultRoute);

// Prefetch Data for API.
ForegroundData.init();

server.listen(22164, function() {
  console.log('%s listening at %s', server.name, server.url);
});
