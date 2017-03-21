'use strict';

/*
 * This is intended to start necessary effort for sync access to data for server-side rendering.
 */
const List = require('./list.js');

function serverListData(req, properties) {
  let json = List.generateJSON('top', 0, 20);

  list.entities = list.$entities;
  return list;
}

module.exports = provideRenderData;