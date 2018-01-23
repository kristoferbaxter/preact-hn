const path = require('path');
const fs = require('fs');
const UglifyJS = require('uglify-es');
const {execSync} = require('child_process');
const {compress} = require('wasm-brotli');
const {promisify} = require('util');

// calling pattern `node uglify.js {classification} {worker}`
// process.argv=['node', 'uglify.js', classification]
const classification = process.argv[2];
const interpretServiceWorker = process.argv[3] === 'true';
const {assets} = JSON.parse(fs.readFileSync(path.resolve('dist', classification, 'webpack.json'), 'utf8'));
const jsFiles = assets.filter(asset => asset.name.endsWith('.js'));
const applicationJsFile = jsFiles.filter(asset => asset.name.includes('bundle.application'));
const routeJsFiles = jsFiles.filter(asset => !asset.name.includes('bundle.application'));
const writeFileAsync = promisify(fs.writeFile);

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
  // import { compress } from 'wasm-brotli';
  // import { writeFile } from 'fs';
  // import { promisify } from 'util';

  // const writeFileAsync = promisify(writeFile);

  // const content = Buffer.from('Hello, world!', 'utf8');

  // (async () => {
  //   try {
  //     const compressedContent = await compress(content);
  //     await writeFileAsync('./hello_world.txt.br', compressedContent);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // })();

  const filePath = path.resolve('dist', classification, name);
  const fileContent = fs.readFileSync(filePath);
  compress(fileContent).then(compressedFileContent => {
    fs.writeFileSync(`${filePath}.br`, compressedFileContent, 'utf8');
  });

  // const filePath = path.resolve('dist', classification, name);
  // execSync(`brotli -q 11 ${filePath}`);
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
      // brotliFile(name); disabled until brotli resource paths are unique.
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
