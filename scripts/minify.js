const path = require('path');
const fs = require('fs');
const Uglify = require('uglify-es');
const brotli = require('wasm-brotli');
const zopfli = require('wasm-zopfli');
const util = require('util');

// calling pattern `node uglify.js {classification} {worker}`
// process.argv=['node', 'uglify.js', classification]
const classification = process.argv[2];
const interpretServiceWorker = process.argv[3] === 'true';
const {assets} = JSON.parse(fs.readFileSync(path.resolve('dist', classification, 'webpack.json'), 'utf8'));
const jsFiles = assets.filter(asset => asset.name.endsWith('.js'));
const applicationJsFile = jsFiles.filter(asset => asset.name.includes('bundle.application'));
const routeJsFiles = jsFiles.filter(asset => !asset.name.includes('bundle.application'));
const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

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
  const {code: optimizedContent} = Uglify.minify(fileContent, Object.assign(defaultOptions, {nameCache: nameCache}));

  fs.writeFileSync(filePath, optimizedContent, 'utf8');
}

async function brotliFile(name) {
  try {
    const filePath = path.resolve('dist', classification, name);
    const fileContent = await readFileAsync(filePath);
    const compressedFileContent = await brotli.compress(fileContent);
    await writeFileAsync(`${filePath}.br`, compressedFileContent);
  } catch (error) {
    console.log(`Error brotli compressing ${name}.`);
  }
}
async function zopfliFile(name) {
  try {
    const filePath = path.resolve('dist', classification, name);
    const fileContent = await readFileAsync(filePath);
    const compressedFileContent = await zopfli.gzip(fileContent);
    await writeFileAsync(`${filePath}.gzip`, compressedFileContent);
  } catch (error) {
    console.log(`Error zopfli compressing ${name}.`);
  }
}

async function optimizeFileDelivery(name) {
  uglifyFile(name);
  switch (classification) {
    case 'chrome':
    case 'firefox':
      await brotliFile(name);
      break;
    case 'safari':
      // await brotliFile(name); disabled until brotli resource paths are unique.
      await zopfliFile(name);
      break;
    default:
      await zopfliFile(name);
      break;
  }
}

(async function() {
  if (!interpretServiceWorker) {
    optimizeFileDelivery(applicationJsFile[0].name);

    routeJsFiles.forEach(routeFile => {
      optimizeFileDelivery(routeFile.name);
    });
  } else if (classification === 'chrome') {
    optimizeFileDelivery('service-worker.js');
  }
})();
