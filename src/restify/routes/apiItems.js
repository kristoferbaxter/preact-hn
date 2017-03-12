'use strict';

const items = require('../items/items.js');

function apiTopRoute(req, res, next) {
  res.setHeader('content-type', 'application/json; charset=utf-8');

  const ItemsToRetrieve = JSON.parse(req.query.items);

  res.send({
    '$entities': ItemsToRetrieve.reduce(function(acc, cur, index) {
      const item = items.get(cur, req.log);
      acc[item.id] = item;
      return acc;
    }, {})
  });

  next();
}

module.exports = apiTopRoute;