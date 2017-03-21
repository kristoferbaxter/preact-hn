'use strict';

import {MemoryRetrieveAll, MemoryRetrieve, MemoryStore} from './memory.js';
import {ITEMS_PER_PAGE, LIST_TYPES} from '../../lists/constants.js';

let LIST_MAX = {};
let LATEST_UUID = {};
// Pre-populate based on how many list types are supported.
Object.keys(LIST_TYPES).forEach(function(list) {
  LIST_MAX[list] = null;
  LATEST_UUID[list] = null;
});

function determineListRange(page) {
  const from = (page-1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE;
  
  return {
    from,
    to
  };
}

function deriveResponse({type, to, from, page}, json) {
  const {uuid, items, max, $entities} = json;

  LATEST_UUID[type] = uuid;
  MemoryStore({[uuid]: Object.assign(items, MemoryRetrieve(uuid))});
  LIST_MAX[type] = max;
  MemoryStore($entities);

  return {
    uuid,
    items: Object.assign({}, ...Object.keys(items)
      .filter(key => key >= from && key <= to)
      .map(key => ({[key]: items[key]}))),
    type,
    page,
    max,
    entities: MemoryRetrieveAll()
  };
}

/*
return {
  partial: function(),
  complete: function(),
  error: function()
}
*/
function GetListApi({listType, page=1, uuid=LATEST_UUID[listType]}, callbacks) {
  const list = MemoryRetrieve(uuid);
  const stored = uuid && list;
  const {from, to} = determineListRange(page);

  if (stored) {
    // The memory store has data for this uuid, filter the data for the range requested (from->to).
    const cachedKeys = Object.keys(list).filter(itemOrder => itemOrder >= from && itemOrder <= to);

    // Create a copy of the data for the range we have in-memory.
    // This allows the UI to have at least a partial response.
    let cachedItems = {};
    cachedKeys.forEach(function insert(key) {
      cachedItems[key] = stored[key];
    });
    const storedResponse = {
      uuid,
      items: cachedItems,
      type: listType,
      page,
      max: LIST_MAX[listType],
      entities: MemoryRetrieveAll()  
    };

    if (cachedKeys.length >= (to-from)) {
      // If the filtered items (only ones within the range of from->to) 
      // has a length equal to the length between from and to...
      // then all the items are present in the cachedKeys.
      callbacks.complete(storedResponse);
    } else {
      // Give the UI the partial response before we fetch the remainder.
      callbacks.partial(storedResponse);

      // Fetch the missing values.
      fetch(`/api/list/${listType}?uuid=${uuid}&from=${from}&to=${to}`)
        .then(response => response.json())
        .then(json => callbacks.complete(deriveResponse({type: listType, to, from, page}, json)))
        .catch(error => callbacks.error(error));
    }
  } else {
    fetch(`/api/list/${listType}?from=${from}&to=${to}`)
      .then(response => response.json())
      .then(json => callbacks.complete(deriveResponse({type: listType, to, from, page}, json)))
      .catch(error => callbacks.error(error));
  }
}

export {
  GetListApi,
  determineListRange
};