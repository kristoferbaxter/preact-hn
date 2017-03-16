'use strict';

const fs = require('fs');
const path = require('path');
const ListData = require('../../storage/lists.js');
const ItemsData = require('../../storage/items.js');

function apiNewRoute(req, res, next) {
  res.setHeader('content-type', 'application/json; charset=utf-8');

  const type = req.params.type;
  const latestUUID = ListData.uuid(type);
  const latestNewItems = ListData.latest(type);
  const rangedItems = latestNewItems.slice(0,20);

  res.send({
    'uuid': latestUUID,
    'from': 0,
    'to': 20,
    'max': latestNewItems.length,
    'items': rangedItems,
    '$entities': rangedItems.reduce(function(acc, cur, index) {
      const item = ItemsData.get(cur, req.log);
      acc[item.id] = item;
      return acc;
    }, {})
  });

  next();
}

module.exports = apiNewRoute;