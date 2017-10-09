import fs from 'fs';
import path from 'path';

const CLASSIFICATIONS = ['chrome', 'edge', 'safari', 'firefox', 'fallback'];

export default function loadResources(bunyanLogger) {
  let returnedResources = {};

  CLASSIFICATIONS.forEach(classification => {
    fs.readFile(path.resolve('dist', classification, 'webpack.json'), 'utf8', function(err, data) {
      if (err) {
        bunyanLogger.error(err);
        return;
      }
      const {assetsByChunkName} = JSON.parse(data);
      const cssFilename = assetsByChunkName.application.filter(filename => /.css/.test(filename));
      const jsFilename = assetsByChunkName.application.filter(filename => /.js/.test(filename));
      const jsRoutes = Object.keys(assetsByChunkName)
        .filter(key => key !== 'application')
        .reduce((res, key) => ((res[key] = `/dist/${classification}/${assetsByChunkName[key]}`), res), {});
      //.reduce((res, key) => (res[key] = { js: `/dist/${classification}/${assetsByChunkName[key][0]}`, css: `/dist/${classification}/${assetsByChunkName[key][1]}`}, res), {});

      if (cssFilename && cssFilename.length > 0 && jsFilename && jsFilename.length > 0) {
        fs.readFile(path.resolve('dist', classification, cssFilename[0]), 'utf8', function(err, data) {
          if (err) {
            bunyanLogger.error(err);
            return;
          }

          returnedResources[classification] = {
            css: {
              inline: data,
              url: `/dist/${classification}/${cssFilename[0]}`,
            },
            js: `/dist/${classification}/${jsFilename[0]}`,
            'service.worker': assetsByChunkName['service.worker'],
            routes: jsRoutes,
          };

          bunyanLogger.info(`RESOURCES – Load – ${classification} success`);
        });
      }
    });
  });

  return returnedResources;
}
