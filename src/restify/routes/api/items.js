'use strict';

const ItemsData = require('../../storage/items.js');

function apiItemsRoute(req, res, next) {
  res.setHeader('content-type', 'application/json; charset=utf-8');

  const ItemsToRetrieve = JSON.parse(req.query.items);

  res.send({
    '$entities': ItemsToRetrieve.reduce(function(acc, cur, index) {
      const item = ItemsData.get(cur, req.log);
      acc[item.id] = item;
      return acc;
    }, {})
  });

  next();
}

module.exports = apiItemsRoute;