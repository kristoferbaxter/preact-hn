'use strict';

const useragent = require('useragent');

/**
 * Classify the browser based on user-agent
 * @public
 * @function classifyBrowser
 * @returns {Function}
 */
function classifyBrowser(opts) {
  function userAgentClassification(req, res, next) {
    const {family, major} = useragent.lookup(req.headers['user-agent']);
    const lowerCaseFamily = family.toLowerCase();

    req.log.info(`user-agent: ${req.headers['user-agent']}`);
    req.log.info(`user-agent parsed: ${family}, ${major}`);
    
    if (lowerCaseFamily === 'chrome' || lowerCaseFamily === 'chrome mobile' && major >= 52) {
      req.userAgentClassifiction='chrome';
    } else if (lowerCaseFamily === 'safari' || lowerCaseFamily === 'safari mobile' && major >= 10) {
      req.userAgentClassifiction='safari';
    } else if (lowerCaseFamily === 'firefox' && major >= 51) {
      req.userAgentClassifiction='firefox';
    } else if (lowerCaseFamily === 'edge' && major >= 15) {
      req.userAgentClassifiction='edge';
    } else {
      req.userAgentClassifiction='fallback';  
    }
    
    next();
  }

  return (userAgentClassification);
}

module.exports = classifyBrowser;