'use strict';

const uuid = require('uuid/v1');
const fetch = require('node-fetch');
const items = require('./items.js');
const LIST_TYPES = require('./list-types.js');

var LATEST_UUID = {};
var LATEST_DATA = {};
var IN_MEMORY_DATA = {};
Object.keys(LIST_TYPES).forEach(function(list) {
  LATEST_UUID[list] = null;
  LATEST_DATA[list] = null;
});

const FETCH_LOCATIONS = {
  [LIST_TYPES['top']]: 'https://hacker-news.firebaseio.com/v0/topstories.json',
  [LIST_TYPES['new']]: 'https://hacker-news.firebaseio.com/v0/newstories.json',
  [LIST_TYPES['show']]: 'https://hacker-news.firebaseio.com/v0/showstories.json',
  [LIST_TYPES['ask']]: 'https://hacker-news.firebaseio.com/v0/askstories.json',
  [LIST_TYPES['jobs']]: 'https://hacker-news.firebaseio.com/v0/jobstories' 
}

/*
 * type {String}:MemberOf(LIST_TYPES)
 * callbacks {Object}
 *  - success {Function}
 *  - error {Function}
 */
function update(type, log, callbacks) {
  fetch(FETCH_LOCATIONS[type])
    .then(response => response.json())
    .then(function handleUpdatedData(json) {
      const thisUpdateUUID = uuid();

      IN_MEMORY_DATA[thisUpdateUUID] = json;
      LATEST_DATA[type] = json;
      LATEST_UUID[type] = thisUpdateUUID;

      log.warn(`uuid: ${thisUpdateUUID} retrieved`);

      // Ask the items to be pre-cached.
      json.forEach((item) => items.get(item, log));
      
      callbacks.success();  
    })
    .catch(function errorHandler(error) {
      log.error('unable to update data', error);
    
      callbacks.error();
    });
}

module.exports = {
  uuid: (type) => LATEST_UUID[type],
  latest: (type) => LATEST_DATA[type],
  all: () => IN_MEMORY_DATA,
  update: update
};