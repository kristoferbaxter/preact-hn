'use strict';

/*
 * This is intended to start necessary effort for sync access to data for server-side rendering.
 */

const ListData = require('../../storage/lists.js');
const ItemsData = require('../../storage/items.js');

function provideRenderData(req, properties) {
  req.log.info('provideRenderData called');

  const latestUUID = ListData.uuid('top');
  const latestTopItems = ListData.latest('top').slice(0,20);
  const latestEntities = latestTopItems.reduce(function(acc, cur, index) {
    const item = ItemsData.get(cur, req.log);
    acc[item.id] = item;
    return acc;
  }, {});

  return {
    uuid: latestUUID,
    from: 0,
    to: 20,
    items: latestTopItems,
    entities: latestEntities
  };
}

module.exports = provideRenderData;