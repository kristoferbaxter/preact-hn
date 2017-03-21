'use strict';

/**
 * Issue directive to H2 proxy to H2 push critical resources.
 * @public
 * @function preloads
 * @returns {Function}
 */
function preloads(opts) {
  function sendPreloads(req, res, next) {
    // Note: this section is a hack
    // We are sending a http status code of 100 back to h2o with a header
    // Link: <file>; rel=preload, <file>; rel=preload
    // This 100 indicates to h2o it should h2 server push these linked files.
    if (req.resources) {
      const CRLF = '\r\n';
      const js = [req.resources.js, req.resources.route.js];

      let strlinks = '';
      for (var iterator in js) {
        strlinks += CRLF + `Link: <${js[iterator]}>; rel=preload; as=script`;
      }

      // When enabling CSS files in the future, push them.
      //const css = [req.resources.route.css];
      //for (var iterator in css) {
      //  strlinks += CRLF + `Link: <${css[iterator]}>; rel=preload; as=style`;
      //}

      const rawWrite = `HTTP/1.1 100 Continue${strlinks}${CRLF}${CRLF}`;
      req.log.warn(`raw write: ${rawWrite}`);

      res._writeRaw(rawWrite, 'ascii');
    }
    
    next();
  }
  
  return (sendPreloads);
}

module.exports = preloads;