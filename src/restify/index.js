const restify = require('restify');
const bunyan = require('bunyan');
const WebpackResources = require('./resources.js');
const TopData = require('./top/top.js');

// Restify Plugins
const classifyBrowser = require('./plugins/classifyBrowser.js');
const setRequestResources = require('./plugins/setRequestResources.js');
const preloads = require('./plugins/preloads.js');

// Routes
const apiTopRoute = require('./routes/apiTop.js');
const apiItemsRoute = require('./routes/apiItems.js');
const defaultRoute = require('./routes/default.js');

// Server Constants
const APPLICATION_NAME = 'hn-web';
const logger = bunyan.createLogger({
  name: APPLICATION_NAME
});
const browserResources = WebpackResources(logger);

const server = restify.createServer({
  name: APPLICATION_NAME,
  log: logger
});
server.use(restify.requestLogger());
server.use(restify.bodyParser());
server.use(restify.queryParser());
server.use(classifyBrowser());
server.use(setRequestResources(browserResources));
server.use(preloads());

// TODO: Do not duplicate route definitions...
// Programatically derive from a single source of truth.
server.get('/api/top', apiTopRoute);
server.get('/api/items', apiItemsRoute);
server.get('/', defaultRoute);
server.get('/top', defaultRoute);
server.get('/top/.*', defaultRoute);
server.get('/item/.*', defaultRoute);

// Prefetch Data for API.
const successfulUpdate = () => setTimeout(TopData.update, 600000, logger, successfulUpdate, errorUpdate);
const errorUpdate = () => setTimeout(TopData.update, 600000, logger, successfulUpdate, errorUpdate);
TopData.update(logger, successfulUpdate, errorUpdate);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
