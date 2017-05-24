'use strict';

const fs = require('fs');
const path = require('path');
import {determineListRange} from '../../../core/api/list.js';
const ForegroundData = require('../../storage/foreground.js');

function generateJSON(req, {type, from, to, uuid}) {
  const latestNewItems = ForegroundData.latest(type);
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
      const item = ForegroundData.getItem(cur, req.log);
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
  const to = parseInt(req.query.to || 29, 10);
  const uuid = req.query.uuid || ForegroundData.uuid(type);
  
  res.send(generateJSON(req, {type, from, to, uuid}));

  next();
}

function serverListRoute(req, {type}) {
  const page = req.params.id || 1;
  const {from, to} = determineListRange(page);
  let json = generateJSON(req, {type, from, to, uuid: ForegroundData.uuid(type)});

  json.page = page;
  return json;
}

module.exports = {
  route: apiListRoute,
  serverRoute: serverListRoute
}