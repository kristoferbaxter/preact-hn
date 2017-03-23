const path = require('path');
const fs = require('fs');

function staticRoute(req, res, next) {
  fs.readFile(path.resolve('dist', 'chrome', 'sw.js'), 'utf8', function(err, data) {
    res.writeHead(200, {
      'content-type': 'application/javascript; charset=utf-8',
      'timing-allow-origin': '*',
      'access-control-allow-credentials': 'true',
      'access-control-allow-origin': '*'
    });
    res.write(data);
    
    res.end();
    next();
  });
}

module.exports = staticRoute;