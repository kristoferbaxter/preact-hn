'use strict';

const fetch = require('node-fetch');
const jsonfile = require('jsonfile');
const path = require('path');

let ALL_ITEMS = {};

function retrieveItem(id, log, forceReload, callback) {
  if (!forceReload && ALL_ITEMS[id]) {
    if (callback) {
      callback('success');
    }

    return;
  }

  fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    .then(response => response.json())
    .then(function handleJson(json) {
      ALL_ITEMS[id] = json;

      if (callback) {
        callback('success');
      }
    })
    .catch(function handleError(error) {
      ALL_ITEMS[id] = null;

      if (callback) {
        callback('error');
      }
    }); 
}

function getItem(id, log) {
  log.warn('getItem', id);
  if (ALL_ITEMS[id]) {
    return ALL_ITEMS[id];
  }

  retrieveItem(id, log, false);
  return null;
}

function storeItemsAsync(id, log) {
  // This is pretty hacky... consider moving to Firebase client.
  retrieveItem(id, log, true, (status) => {
    if (status === 'success') {
      const item = ALL_ITEMS[id];
      const kidsCount = item.kids && item.kids.length;

      if (kidsCount > 0) {
        item.kids.forEach((kid, index) => {
          log.warn(`${id} stored, grabbing kid: ${kid}, remaining: ${(kidsCount-1) - index}`);  
          storeItemsAsync(kid, log, true);
        });
      }
    }
  });
}

function init() {
  // TODO: Load from file system the cached copy of the json retrieved already.
}

function exportCache() {
  // Work in progress, cache current entries on filesystem for faster startup.
  const file = path.resolve(__dirname, 'storage/items.json');
 
  jsonfile.writeFile(file, ALL_ITEMS, function (err) {
    console.error(err);
  });
}

module.exports = {
  init: init,
  get: getItem,
  store: storeItemsAsync
};