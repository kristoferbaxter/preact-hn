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
      return routeResources && {
        js: routeResources.ItemHome//.js,
        //css: routeResources.ItemHome.css
      };
    } else if (/\/user/.test(req.url)) {
      return routeResources && {
        js: routeResources.UserHome//.js,
        //css: routeResources.UserHome.css
      };
    }
    return routeResources && {
      js: routeResources.ListHome//.js,
      //css: routeResources.ListHome.css
    };
  }

  function setResources(req, res, next) {
    const resources = resourcesList[req.userAgentClassifiction];

    if (!/\/api\//.test(req.url) && resources) {
      req.resources = {
        inline: resources && resources.css && resources.css.inline,
        css: resources && resources.css && resources.css.url,
        js: resources && resources.js,
        'service.worker': resources && resources['service.worker'],
        route: routeBundle(req, resources)
      }
    }
    
    next();
  }

  return (setResources);
}

module.exports = setRequestResources;