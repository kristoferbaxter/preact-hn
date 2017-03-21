const restify = require('restify');
const bunyan = require('bunyan');
const WebpackResources = require('./resources.js');
const ListData = require('./storage/lists.js');

// Restify Plugins
const classifyBrowser = require('./plugins/classifyBrowser.js');
const setRequestResources = require('./plugins/setRequestResources.js');
const preloads = require('./plugins/preloads.js');

// Routes
const apiList = require('./routes/api/list.js');
const apiItems = require('./routes/api/items.js');
const apiComments = require('./routes/api/comments.js');
const defaultRoute = require('./routes/default-serverrender.js');

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
server.get('/api/list/:type', apiList.route);
server.get('/api/items', apiItems.route);
server.get('/api/comments/:id', apiComments.route);
server.get('/:type/:id', defaultRoute);
server.get('/.*', defaultRoute);

// Prefetch Data for API.
ListData.init(logger);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
