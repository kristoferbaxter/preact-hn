import cp from 'child_process';
import {LIST_TYPES} from 'utils/constants';

const updateThread = cp.fork('dist/server/restify.background.js'); // TODO: FIX THIS PATH, USE require('path')

const UPDATE_TIMER = 300000;
let LATEST_UUID = {};
let LATEST_DATA = {};
let ALL_ITEMS = {};
Object.keys(LIST_TYPES).forEach(function(list) {
  LATEST_UUID[list] = null;
  LATEST_DATA[list] = null;
});

export function init() {
  Object.keys(LIST_TYPES).forEach(function(type) {
    updateThread.send({type});
  });
}
export function getItem(id) {
  if (ALL_ITEMS[id]) {
    return ALL_ITEMS[id];
  }

  updateThread.send({id});
  return null;
}
export function uuid(type) {
  return LATEST_UUID[type];
}
export function latest(type) {
  return LATEST_DATA[type];
}

updateThread.on('message', (message) => {
  const {item, id, type, error, uuid, list} = message;

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
});