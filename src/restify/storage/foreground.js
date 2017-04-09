'use strict';

const cp = require('child_process');
const updateThread = cp.fork('dist/server/restify.background.js'); // TODO: FIX THIS PATH, USE require('path')
import {LIST_TYPES} from '../../lists/constants.js';

const UPDATE_TIMER = 300000;
let LATEST_UUID = {};
let LATEST_DATA = {};
let ALL_ITEMS = {};
Object.keys(LIST_TYPES).forEach(function(list) {
  LATEST_UUID[list] = null;
  LATEST_DATA[list] = null;
});

function init() {
  Object.keys(LIST_TYPES).forEach(function(type) {
    updateThread.send({type});
  });
}

function getItem(id) {
  if (ALL_ITEMS[id]) {
    return ALL_ITEMS[id];
  }

  updateThread.send({id});
  return null;
}

updateThread.on('message', (message) => {
  const {item, id, type, error, uuid, list, allItems} = message;

  if (!error) {
    if (list) {
      LATEST_DATA[type] = list;
      LATEST_UUID[type] = uuid;

      setTimeout(() => {
        updateThread.send({type});
      }, UPDATE_TIMER);
    } else if (item) {
      ALL_ITEMS[id] = item; 
    }
  }
})

module.exports = {
  uuid: (type) => LATEST_UUID[type],
  latest: (type) => LATEST_DATA[type],
  init: init,
  getItem: getItem
};