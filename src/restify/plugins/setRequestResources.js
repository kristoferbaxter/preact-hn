'use strict';

/**
 * Set on the request the resources needed for this particular request.
 * @public
 * @function setRequestResources
 * @returns {Function}
 */
function setRequestResources(resourcesList) {
  function routeBundle(req, resources) {
    const routeResources = resources && resources.routes;
    
    if (/\/item/.test(req.url)) {
      return routeResources && routeResources.ItemHome;
    } else if (/\/user/.test(req.url)) {
      return routeResources && routeResources.UserHome;
    }
    return routeResources && routeResources.ListHome;
  }

  function setResources(req, res, next) {
    const resources = resourcesList[req.userAgentClassifiction];

    if (!/\/api\//.test(req.url) && resources) {
      req.resources = {
        inline: resources && resources.css && resources.css.inline,
        css: resources && resources.css && resources.css.url,
        js: resources && resources.js,
        'service.worker': resources && resources['service.worker'],
        route: {
          js: routeBundle(req, resources)
        }
      }
    }
    
    next();
  }

  return (setResources);
}

module.exports = setRequestResources;