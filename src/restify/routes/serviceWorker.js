const path = require('path');
const fs = require('fs');

function staticRoute(req, res, next) {
  fs.readFile(path.resolve('dist', 'chrome', 'sw.js'), 'binary', function(err, data) {
    res.writeHead(200, {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Timing-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*'
    });

    res.end(data, 'binary');
    next();
  });
}

module.exports = staticRoute;