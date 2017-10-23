/**
 * Set on the request the resources needed for this particular request.
 * @public
 * @function setRequestResources
 * @returns {Function}
 */
export default function setRequestResources(resourcesList) {
  function routeBundle(req, resources) {
    const routeResources = resources && resources.routes;

    if (routeResources) {
      if (/\/item/.test(req.url)) {
        return {
          js: routeResources.ItemHome,
        };
      }

      if (/\/about/.test(req.url)) {
        return {
          js: routeResources.AboutHome,
        };
      }

      if (/\/user/.test(req.url)) {
        return {
          js: routeResources.UserHome,
        };
      }

      return {
        js: routeResources.ListHome ? routeResources.ListHome : null,
      };
    }

    return {
      js: null,
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
        route: routeBundle(req, resources),
      };
    }

    next();
  }

  return setResources;
}
