1. You'll need to download h2o to run locally. 
   - Typically just use 'brew', 'brew update; brew install h2o'
   - Here is the full documentation: https://h2o.examp1e.net/install.html
2. You'll need to install Brotli CLI and Zopfli for compression to production.
   - Typically just use 'brew', 'brew update; brew install brotli; brew install zopfli'
   - https://github.com/google/brotli
3. You'll also need to port forward or allow access for h2o to run on port 443 (https) and 80 (http)
   - https://salferrarello.com/mac-pfctl-port-forwarding/
   - Start:
     echo "
      rdr pass inet proto tcp from any to any port 80 -> 127.0.0.1 port 5080
      rdr pass inet proto tcp from any to any port 443 -> 127.0.0.1 port 5443
     " | sudo pfctl -ef -
   - Kill:
     sudo pfctl -F all -f /etc/pf.conf
4. Chrome doesn't allow for self-signed certs for ServiceWorkers. 
   To work around the issue, you'll need to launch ignoring certs.
   open /Applications/Google\ Chrome\ Canary.app --args --allow-insecure-localhost