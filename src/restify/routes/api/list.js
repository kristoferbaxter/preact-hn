'use strict';

const fs = require('fs');
const path = require('path');
import {determineListRange} from '../../../core/api/list.js';
const ListData = require('../../storage/lists.js');
const ItemsData = require('../../storage/items.js');

function generateJSON(req, {type, from, to, uuid}) {
  const latestNewItems = ListData.latest(type);
  const rangedItems = latestNewItems.slice(from,to);

  return {
    'uuid': uuid,
    'type': type,
    'from': from,
    'to': to,
    'max': latestNewItems.length,
    'items': rangedItems.reduce(function(acc, cur, index) {
      acc[index+from] = cur;
      return acc;
    }, {}),
    '$entities': rangedItems.reduce(function(acc, cur, index) {
      const item = ItemsData.get(cur, req.log);
      if (item) {
        acc[item.id] = item;
      }
      return acc;
    }, {})
  }
}

function apiListRoute(req, res, next) {
  res.setHeader('content-type', 'application/json; charset=utf-8');

  const type = req.params.type;
  const from = parseInt(req.query.from || 0, 10);
  const to = parseInt(req.query.to || 20, 10);
  const uuid = req.query.uuid || ListData.uuid(type);
  
  res.send(generateJSON(req, {type, from, to, uuid}));

  next();
}

function serverListRoute(req, {type}) {
  const page = req.params.id || 1;
  const {from, to} = determineListRange(page);
  let json = generateJSON(req, {type, from, to, uuid: ListData.uuid(type)});

  json.page = page;
  return json;
}

module.exports = {
  route: apiListRoute,
  serverRoute: serverListRoute
}