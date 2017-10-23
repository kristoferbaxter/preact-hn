import path from 'path';
import fs from 'fs';

function fileValues(req, file, classification) {
  const format = req.canDecodeBrotli ? ['br', 'gzip'] : ['gzip'];
  let returnValue = {
    finalFormat: null,
    finalFile: file,
  };

  format.some(formatValue => {
    const testFile = file.replace('.js', `.js.${formatValue}`);
    if (fs.existsSync(path.resolve('dist', classification, testFile))) {
      returnValue = {
        finalFormat: formatValue,
        finalFile: testFile,
      };
      return true;
    }
    return false;
  });

  return returnValue;
}

export default function staticRoute(req, res, next) {
  const {classification, file} = req.params;

  if (['chrome', 'safari', 'firefox', 'edge', 'fallback'].indexOf(classification) >= 0) {
    const {finalFormat, finalFile} = fileValues(req, file, classification);
    const resolvedPath = path.resolve('dist', classification, finalFile);
    let stream = fs.createReadStream(resolvedPath);

    stream.on('error', error => {
      res.writeHead(404, {
        'Content-Type': 'text/plain',
      });

      res.end('file not found');
      req.log.warn(`${resolvedPath} file not found.`);
      next();
    });
    stream.on('open', () => {
      res.writeHead(200, {
        'Content-Type': 'text/javascript',
        'Cache-Control': 'public,max-age=31536000,immutable',
        'Timing-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*',
        'Content-Encoding': finalFormat,
      });
      stream.pipe(res);
    });
    stream.on('end', () => {
      req.log.info(`${resolvedPath} file delivered.`);
      next();
    });
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/plain',
    });

    res.end('file not found');
    next();
  }
}
