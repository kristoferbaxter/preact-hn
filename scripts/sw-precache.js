const {execSync} = require("child_process");

(function() {
  execSync(`./node_modules/sw-precache/cli.js --config config/sw-precache.js; mv service-worker.js dist/chrome/service-worker.js`);
})();