1. You'll need to install Brotli CLI and Zopfli for compression to production.
   - Typically just use 'brew', 'brew update; brew install brotli; brew install zopfli'
   - https://github.com/google/brotli
2. Chrome doesn't allow for self-signed certs for ServiceWorkers. 
   To work around the issue, you'll need to launch ignoring certs.
   open /Applications/Google\ Chrome\ Canary.app --args --allow-insecure-localhost