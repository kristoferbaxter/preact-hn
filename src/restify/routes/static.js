const path = require('path');
const fs = require('fs');

function fileValues(file, classification) {
  const format = ['chrome', 'firefox'].indexOf(classification) >= 0 ? ['br', 'gzip'] : ['gzip'];
  let returnValue = {
    finalFormat: null,
    finalFile: file
  };

  format.some((formatValue) => {
    const testFile = file.replace('.js', `.js.${formatValue}`);
    if (fs.existsSync(path.resolve('dist', classification, testFile))) {
      returnValue = {
        finalFormat: formatValue,
        finalFile: testFile
      };
      return true;
    }
    return false;
  });

  return returnValue;
}

function staticRoute(req, res, next) {
  const {classification, file} = req.params;

  if (['chrome', 'safari', 'firefox', 'edge', 'fallback'].indexOf(classification) >= 0) {
    const {finalFormat, finalFile} = fileValues(file, classification);

    fs.readFile(path.resolve('dist', classification, finalFile), 'binary', function(err, data) {
      res.writeHead(200, Object.assign({
        'Content-Type': 'text/javascript',
        'Cache-Control': 'public,max-age=31536000,immutable',
        'timing-allow-origin': '*',
        'access-control-allow-credentials': 'true',
        'access-control-allow-origin': '*'
      }, finalFormat ? {'Content-Encoding': finalFormat} : {}));

      res.end(data, 'binary');
      next();
    });
  } else {
    res.writeHead(404);
    
    res.end();
    next();
  }
}

module.exports = staticRoute;