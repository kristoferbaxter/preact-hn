const CACHE_VERSION = 1;
const CACHE_NAME = `hn-web-${CACHE_VERSION}`;

self.addEventListener('install', (event) => {
  const URLS = ['/'];
  // This list needs to be programatically generated.
  // Clients are right now retrieving subsequent bundles when interactions occur (not good).
  // Alternative, Worker can contact server with it's version number and get assets to cache.

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const cachePromises = URLS.map((cacheUrl) => {
        const requestUrl = new URL(cacheUrl, location.href);
        const request = new Request(requestUrl, {
          credentials: 'include',
          mode: 'no-cors'
        });

        return fetch(request).then((response) => {
          if (response.status >= 400) {
            throw new Error('SW – Precache', `Request for ${cacheUrl} failed with status ${response.statusText}`);
          }

          return cache.put(requestUrl, response);
        }).catch((error) => {
          console.error('SW – Precache', `Not caching ${cacheUrl} due to ${error}`);
        });
      });

      return Promise.all(cachePromises).then(() => {
        console.log('SW – Precache', 'Pre-fetch complete.');
      });
    }).catch((error) => {
      console.error('SW – Precache', 'Pre-fetch failed:', error);
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('SW – Fetch', 'Event:', event);
  // Try the cache
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      /*
      const fetchRequest = new Request(event.request.url, {
        method: event.request.method,
        headers: event.request.headers,
        mode: 'same-origin', // need to set this properly
        credentials: event.request.credentials,
        redirect: 'manual'   // let browser handle redirects
      });
      */
      
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // IMPORTANT: Clone the response. A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    }).catch((error) => {
      console.error('SW – Fetch', 'fetch failed:', error);
    })
  );
});