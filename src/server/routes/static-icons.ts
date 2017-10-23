import path from 'path';
import fs from 'fs';

export default function staticRoute(req, res, next) {
  const {file} = req.params;

  if (fs.existsSync(path.resolve('dist', 'server', 'static', 'icons', file))) {
    fs.readFile(path.resolve('dist', 'server', 'static', 'icons', file), 'binary', function(err, data) {
      res.writeHead(200, {
        'Content-Type': file.indexOf('.ico') >= 0 ? 'image/x-icon' : 'image/png',
        'Cache-Control': 'public,max-age=31536000,immutable',
        'Timing-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*',
      });

      res.end(data, 'binary');
      next();
    });
  } else {
    res.writeHead(404);

    res.end();
    next();
  }
}
