import path from 'path';
import fs from 'fs';

export default function staticRoute(req, res, next) {
  fs.readFile(path.resolve('dist', 'chrome', 'service-worker.js'), 'binary', function(err, data) {
    res.writeHead(200, {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Timing-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
    });

    res.end(data, 'binary');
    next();
  });
}
