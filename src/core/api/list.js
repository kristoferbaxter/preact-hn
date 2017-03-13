'use strict';

import {MemoryRetrieveAll, MemoryStore} from './memory.js';

const LIST_TYPES = {
  top: 'top',
  new: 'new',
  show: 'show',
  ask: 'ask',
  jobs: 'jobs'
};

let lists = {};
let LATEST_UUID = {};
// Pre-populate based on how many list types are supported.
Object.keys(LIST_TYPES).forEach(function(list) {
  lists[list] = {};
  LATEST_UUID[list] = null;
});

/*
return {
  partial: function(),
  complete: function(),
  error: function()
}
*/
function GetListApi({listType, from, to, uuid=LATEST_UUID[listType]}, callbacks) {
  const list = lists[listType];
  const stored = uuid && list[uuid];

  if (stored) {
    // The memory store has data for this uuid, filter the data for the range requested (from->to).
    const cachedKeys = Object.keys(list[uuid]).filter(itemOrder => itemOrder >= from && itemOrder <= to);

    // Create a copy of the data for the range we have in-memory.
    // This allows the UI to have at least a partial response.
    let cachedItems = {};
    cachedKeys.forEach(function insert(key) {
      cachedItems[key] = stored[key];
    });

    if (cachedKeys.length = ((to-from) + 1)) {
      // If the filtered items (only ones within the range of from->to) 
      // has a length equal to the length between from and to...
      // then all the items are present in the cachedKeys.
      callbacks.complete({
        uuid: uuid,
        items: cachedItems,
        entities: MemoryRetrieveAll()
      });
    } else {
      // Give the UI the partial response before we fetch the remainder.
      callbacks.partial({
        uuid: uuid,
        items: cachedItems,
        entities: MemoryRetrieveAll()
      });

      // Find what is missing in the range.
      let missingValues = [];
      for (let iterator = from; iterator < to; iterator++) {
        if (!cachedItems[iterator]) {
          missingValues.push(iterator);
        }
      }

      // Fetch the missing values.
      fetch(`/api/${listType}?uuid=${uuid}&values=${JSON.stringify(missingValues)}`)
        .then(response => response.json())
        .then(json => {
          list[json.uuid] = Object.assign(list[json.uuid] || {}, json.items);
          MemoryStore(json.$entities);

          callbacks.complete({
            uuid: uuid,
            items: list[json.uuid],
            entities: MemoryRetrieveAll()
          });
        }).catch(error => {
          callbacks.error(error);
        });
    }
  } else {
    fetch(`/api/${listType}`)
      .then(response => response.json())
      .then(json => {
        LATEST_UUID[listType] = json.uuid;
        list[json.uuid] = Object.assign(list[json.uuid] || {}, json.items);
        MemoryStore(json.$entities);

        callbacks.complete({
          uuid: json.uuid,
          items: list[json.uuid],
          entities: MemoryRetrieveAll()
        });
      }).catch(error => {
        callbacks.error(error);
      });
  }
}

export {
  GetListApi,
  LIST_TYPES
};