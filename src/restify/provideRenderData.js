'use strict';

/*
 * This is intended to start necessary effort for sync access to data for server-side rendering.
 */

const TopData = require('./storage/top-stories.js');
const items = require('./storage/items.js');

function provideRenderData(req, properties) {
  req.log.info('provideRenderData called');

  const latestUUID = TopData.uuid();
  const latestTopItems = TopData.latest().slice(0,20);
  const latestEntities = latestTopItems.reduce(function(acc, cur, index) {
    const item = items.get(cur, req.log);
    acc[item.id] = item;
    return acc;
  }, {});

  return {
    'uuid': latestUUID,
    'from': 0,
    'to': 20,
    'items': latestTopItems,
    '$entities': latestEntities
  };
}

module.exports = provideRenderData;