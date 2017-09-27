const fs = require('fs');
const path = require('path');

const jsFiles = fs.readdirSync(path.resolve('dist', 'chrome')).filter(filename => filename.endsWith('.js.br')).map(filename => `dist/chrome/${filename}`);

module.exports = {
  staticFileGlobs: ['dist/chrome/*.js'],
  dynamicUrlToDependencies: {
    '/shell': jsFiles
  },
  navigateFallback: '/shell',
  
  runtimeCaching: [{
    urlPattern: /\/api\/list\//,
    handler: 'cacheFirst'
  },{
    urlPattern: /\/api\/comments\//,
    handler: 'networkOnly'
  }],
  //logger: function() {}
}