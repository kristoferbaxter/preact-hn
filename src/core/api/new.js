'use strict';

import {MemoryRetrieveAll, MemoryStore} from './memory.js';

let newData = {};
let LATEST_UUID = {
  new: null
};


/*
return {
  partial: function(),
  complete: function(),
  error: function()
}
*/
function GetNewApi({from, to, uuid=LATEST_UUID.new}, callbacks) {
  const stored = uuid && newData[uuid];

  if (stored) {
    // The memory store has data for this uuid, filter the data for the range requested (from->to).
    const cachedKeys = Object.keys(stored).filter(itemOrder => itemOrder >= from && itemOrder <= to);
    
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
      fetch(`/api/new?uuid=${uuid}&values=${JSON.stringify(missingValues)}`)
        .then(response => response.json())
        .then(json => {
          newData[json.uuid] = Object.assign(newData[json.uuid] || {}, json.items);
          MemoryStore(json.$entities);

          callbacks.complete({
            uuid: uuid,
            items: newData[json.uuid],
            entities: MemoryRetrieveAll()
          });
        }).catch(error => {
          callbacks.error(error);
        });
    }
  } else {
    fetch(`/api/new`)
      .then(response => response.json())
      .then(json => {
        LATEST_UUID.new = json.uuid;
        newData[json.uuid] = Object.assign(newData[json.uuid] || {}, json.items);
        MemoryStore(json.$entities);

        callbacks.complete({
          uuid: json.uuid,
          items: newData[json.uuid],
          entities: MemoryRetrieveAll()
        });
      }).catch(error => {
        callbacks.error(error);
      });
  }
};

export {
  GetNewApi
};