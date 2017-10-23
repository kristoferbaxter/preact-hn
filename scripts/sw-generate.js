const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');
const replace = require('replace-in-file');
const git = require('git-rev-sync');

const departure = path.resolve('src', 'service-worker.js');
const destination = path.resolve('dist', 'chrome', 'service-worker.js');

const FALLBACK_DOCUMENT = '/shell';
const prefetchUrls = fs
  .readdirSync(path.resolve('dist', 'chrome'))
  .filter(filename => filename.endsWith('.js') && !filename.startsWith('service-worker'))
  .map(item => `/dist/chrome/${item}`);
prefetchUrls.push(FALLBACK_DOCUMENT);

const versionReplacement = {
  files: destination,
  from: /APP_VERSION/g,
  to: git.short(),
};
const prefetchReplacement = {
  files: destination,
  from: /PREFETCH_URLS/g,
  to: JSON.stringify(prefetchUrls),
};
const fallbackDocumentReplacement = {
  files: destination,
  from: /FALLBACK_DOCUMENT/g,
  to: JSON.stringify(FALLBACK_DOCUMENT),
};
const nodeEnvReplacement = {
  files: destination,
  from: /NODE_ENV/g,
  to: JSON.stringify(process.env.NODE_ENV || 'development'),
};
const networkFirstReplacement = {
  files: destination,
  from: /NETWORK_FIRST_PATTERN/g,
  to: /\/api\/details/,
};
const cacheFirstReplacement = {
  files: destination,
  from: /CACHE_FIRST_PATTERN/g,
  to: /\/api\/list/,
};
const staticReplacement = {
  files: destination,
  from: /STATIC_PRECACHED_PATTERN/g,
  to: /\/dist\/chrome/,
};

try {
  console.log(`[SW] Generating, NODE_ENV: ${process.env.NODE_ENV}`);
  execSync(`cp ${departure} ${destination}`);
  replace.sync(versionReplacement);
  replace.sync(prefetchReplacement);
  replace.sync(fallbackDocumentReplacement);
  replace.sync(nodeEnvReplacement);
  replace.sync(networkFirstReplacement);
  replace.sync(cacheFirstReplacement);
  replace.sync(staticReplacement);
  console.log(`[SW] Generated at ${destination}`);
} catch (error) {
  console.error('Error Generating Service Worker', error);
}
