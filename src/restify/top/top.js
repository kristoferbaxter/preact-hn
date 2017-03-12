'use strict';

const uuid = require('uuid/v1');
const fetch = require('node-fetch');
const items = require('../items/items.js');

var LATEST_UUID = '';
var LATEST_DATA = {};
var IN_MEMORY_DATA = {};

function update(log, success, error) {
  fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    .then(response => response.json())
    .then(function handleUpdatedData(json) {
      const thisUpdateUUID = uuid();

      IN_MEMORY_DATA[thisUpdateUUID] = json;
      LATEST_DATA = json;
      LATEST_UUID = thisUpdateUUID;

      log.warn(`uuid: ${thisUpdateUUID} retrieved`);

      // Ask the items to be pre-cached.
      json.forEach((item) => items.get(item, log));
      
      success();
    })
    .catch(function errorHandler(error) {
      log.error('unable to update data', error);
    
      error();
    });
}

module.exports = {
  uuid: () => LATEST_UUID,
  latest: () => LATEST_DATA,
  all: () => IN_MEMORY_DATA,
  update: update
};