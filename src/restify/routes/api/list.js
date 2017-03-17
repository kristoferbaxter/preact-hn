'use strict';

const fs = require('fs');
const path = require('path');
const ListData = require('../../storage/lists.js');
const ItemsData = require('../../storage/items.js');

function apiNewRoute(req, res, next) {
  res.setHeader('content-type', 'application/json; charset=utf-8');

  const type = req.params.type;
  const from = parseInt(req.query.from || 0, 10);
  const to = parseInt(req.query.to || 20, 10);
  const latestUUID = ListData.uuid(type);
  const latestNewItems = ListData.latest(type);
  const rangedItems = latestNewItems.slice(from,to);

  res.send({
    'uuid': latestUUID,
    'from': from,
    'to': to,
    'max': latestNewItems.length,
    'items': rangedItems.reduce(function(acc, cur, index) {
      acc[index+from] = cur;
      return acc;
    }, {}),
    '$entities': rangedItems.reduce(function(acc, cur, index) {
      const item = ItemsData.get(cur, req.log);
      acc[item.id] = item;
      return acc;
    }, {})
  });

  next();
}

module.exports = apiNewRoute;