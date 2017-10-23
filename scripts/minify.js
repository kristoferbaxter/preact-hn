const path = require('path');
const fs = require('fs');
const UglifyJS = require('uglify-es');
const {execSync} = require('child_process');

// calling pattern `node uglify.js {classification} {worker}`
// process.argv=['node', 'uglify.js', classification]
const classification = process.argv[2];
const interpretServiceWorker = process.argv[3] === 'true';
const {assets} = JSON.parse(fs.readFileSync(path.resolve('dist', classification, 'webpack.json'), 'utf8'));
const jsFiles = assets.filter(asset => asset.name.endsWith('.js'));
const applicationJsFile = jsFiles.filter(asset => asset.name.includes('bundle.application'));
const routeJsFiles = jsFiles.filter(asset => !asset.name.includes('bundle.application'));

let nameCache = {};
let defaultOptions = {
  mangle: classification !== 'fallback',
  compress: true,
  ie8: classification === 'fallback',
  ecma: classification === 'fallback' ? 5 : 8,
};
function uglifyFile(name) {
  const filePath = path.resolve('dist', classification, name);
  const fileContent = fs.readFileSync(filePath).toString();
  const {code: optimizedContent} = UglifyJS.minify(fileContent, Object.assign(defaultOptions, {nameCache: nameCache}));

  fs.writeFileSync(filePath, optimizedContent, 'utf8');
}

function brotliFile(name) {
  const filePath = path.resolve('dist', classification, name);
  execSync(`bro -q 11 --input ${filePath} --output ${filePath + '.br'}`);
}
function zopfliFile(name) {
  const filePath = path.resolve('dist', classification, name);
  execSync(`zopfli -i1000 ${filePath}`);
  execSync(`mv ${filePath + '.gz'} ${filePath + '.gzip'}`);
}

function optimizeFileDelivery(name) {
  uglifyFile(name);
  switch (classification) {
    case 'chrome':
    case 'firefox':
      brotliFile(name);
      break;
    case 'safari':
      brotliFile(name);
      zopfliFile(name);
      break;
    default:
      zopfliFile(name);
      break;
  }
}

(function() {
  if (!interpretServiceWorker) {
    optimizeFileDelivery(applicationJsFile[0].name);

    routeJsFiles.forEach(routeFile => {
      optimizeFileDelivery(routeFile.name);
    });
  } else if (classification === 'chrome') {
    optimizeFileDelivery('service-worker.js');
  }
})();
