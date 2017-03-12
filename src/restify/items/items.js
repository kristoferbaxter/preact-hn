'use strict';

const fetch = require('node-fetch');

var ALL_ITEMS = {};

function getItem(id, log) {
  if (ALL_ITEMS[id]) {
    return ALL_ITEMS[id];
  }

  fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    .then(response => response.json())
    .then(function handleJson(json) {
      log.info(`${id} data returned`);
      ALL_ITEMS[id] = json;
    })
    .catch(function handleError(error) {
      ALL_ITEMS[id] = null;
    });
}

function init() {
  // TODO: Load from file system the cached copy of the json retrieved already.
}

function exportCache() {

}

module.exports = {
  init: init,
  get: getItem
};