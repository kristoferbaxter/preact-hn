'use strict';

const uuid = require('uuid/v1');
const fetch = require('node-fetch');
import {LIST_TYPES} from '../../lists/constants.js';

let ALL_ITEMS = {};
let LATEST_UUID = {};
let LATEST_DATA = {};
Object.keys(LIST_TYPES).forEach(function(list) {
  LATEST_UUID[list] = null;
  LATEST_DATA[list] = null;
});

const FETCH_LOCATIONS = {
  [LIST_TYPES['top']]: 'https://hacker-news.firebaseio.com/v0/topstories.json',
  [LIST_TYPES['new']]: 'https://hacker-news.firebaseio.com/v0/newstories.json',
  [LIST_TYPES['show']]: 'https://hacker-news.firebaseio.com/v0/showstories.json',
  [LIST_TYPES['ask']]: 'https://hacker-news.firebaseio.com/v0/askstories.json',
  [LIST_TYPES['jobs']]: 'https://hacker-news.firebaseio.com/v0/jobstories.json' 
};

process.on('message', (message) => {
  const {type, id} = message;
  if (type) {
    updateList(type, {
      success: (type) => {
        process.send({
          type, 
          uuid: LATEST_UUID[type],
          list: LATEST_DATA[type]
        });
      },
      error: (type) => {
        process.send({
          type, 
          error: true
        });
      } 
    });
  } else if (id) {
    updateItemsRecursively(id);
  }
});

/*
 * type {String}:MemberOf(LIST_TYPES)
 * callbacks {Object}
 *  - success {Function}
 *  - error {Function}
 */
function updateList(type, callbacks) {
  fetch(FETCH_LOCATIONS[type])
    .then(response => response.json())
    .then((json) => {
      const thisUpdateUUID = uuid();

      LATEST_DATA[type] = json;
      LATEST_UUID[type] = thisUpdateUUID;

      // Ask the items to be pre-cached.
      json.forEach((item, index) => {
        //log.info(`please store ${item}, index: ${index}, type: ${type}`);
        updateItemsRecursively(item);
      });
      
      callbacks.success(type);  
    })
    .catch((error) => {
      console.log('unable to update data', error);
    
      callbacks.error(type);
    });
}

/*
 * id {Number}
 * forceReload {Boolean}
 * callbacks {Object}
 *  - success {Function}
 *  - error {Function}
 */
function updateItem(id, forceReload, callbacks) {
  if (!forceReload && ALL_ITEMS[id]) {
    if (callbacks && callbacks.success) {
      callbacks.success(ALL_ITEMS[id]);
    }

    return;
  }

  fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    .then(response => response.json())
    .then((json) => {
      ALL_ITEMS[id] = json;

      if (callbacks && callbacks.success) {
        process.send({
          id,
          item: ALL_ITEMS[id]
        });

        callbacks.success(ALL_ITEMS[id]);
      }
    })
    .catch((error) => {
      ALL_ITEMS[id] = null;

      if (callbacks && callbacks.error) {
        callbacks.error(error);
      }
    }); 
}

function updateItemsRecursively(id) {
  // This is pretty hacky... move to Firebase client.
  updateItem(id, true, {
    success: (item) => {
      if (item.kids && item.kids.length > 0) {
        item.kids.forEach((kid, index) => {
          updateItemsRecursively(kid);
        });
      }
    },
    error: (error) => {
      //console.log(`error updating items`);
    }
  });
}