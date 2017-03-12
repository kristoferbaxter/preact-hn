'use strict';

const fs = require('fs');
const path = require('path');
const TopData = require('../top/top.js');
const items = require('../items/items.js');

function apiTopRoute(req, res, next) {
  res.setHeader('content-type', 'application/json; charset=utf-8');

  const latestUUID = TopData.uuid();
  const latestTopItems = TopData.latest().slice(0,20);

  res.send({
    'uuid': latestUUID,
    'from': 0,
    'to': 20,
    'items': latestTopItems,
    '$entities': latestTopItems.reduce(function(acc, cur, index) {
      const item = items.get(cur, req.log);
      acc[item.id] = item;
      return acc;
    }, {})
  });

  next();
}

module.exports = apiTopRoute;