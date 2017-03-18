'use strict';

import {MemoryRetrieveAll, MemoryStore} from './memory.js';
import LIST_TYPES from '../../restify/storage/list-types.js';
import {ITEMS_PER_PAGE} from '../../lists/constants.js';

let LISTS = {};
let LIST_MAX = {};
let LATEST_UUID = {};
// Pre-populate based on how many list types are supported.
Object.keys(LIST_TYPES).forEach(function(list) {
  LISTS[list] = {};
  LIST_MAX[list] = null;
  LATEST_UUID[list] = null;
});

/*
return {
  partial: function(),
  complete: function(),
  error: function()
}
*/
function GetListApi({listType, page=1, uuid=LATEST_UUID[listType]}, callbacks) {
  const list = LISTS[listType];
  const stored = uuid && list[uuid];
  const from = (page-1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE;

  if (stored) {
    // The memory store has data for this uuid, filter the data for the range requested (from->to).
    const cachedKeys = Object.keys(list[uuid]).filter(itemOrder => itemOrder >= from && itemOrder <= to);

    // Create a copy of the data for the range we have in-memory.
    // This allows the UI to have at least a partial response.
    let cachedItems = {};
    cachedKeys.forEach(function insert(key) {
      cachedItems[key] = stored[key];
    });

    if (cachedKeys.length >= (to-from)) {
      // If the filtered items (only ones within the range of from->to) 
      // has a length equal to the length between from and to...
      // then all the items are present in the cachedKeys.
      callbacks.complete({
        uuid: uuid,
        items: cachedItems,
        type: listType,
        page: page,
        max: LIST_MAX[listType],
        entities: MemoryRetrieveAll()
      });
    } else {
      // Give the UI the partial response before we fetch the remainder.
      callbacks.partial({
        uuid: uuid,
        items: cachedItems,
        type: listType,
        page: page,
        max: LIST_MAX[listType],
        entities: MemoryRetrieveAll()
      });

      // Fetch the missing values.
      fetch(`/api/list/${listType}?uuid=${uuid}&from=${from}&to=${to}`)
        .then(response => response.json())
        .then(json => {
          LATEST_UUID[listType] = json.uuid;
          list[json.uuid] = Object.assign(list[json.uuid] || {}, json.items);
          LIST_MAX[listType] = json.max;
          MemoryStore(json.$entities);

          callbacks.complete({
            uuid: json.uuid,
            items: Object.assign({}, ...Object.keys(list[json.uuid])
                        .filter(key => key >= from && key <= to)
                        .map(key => ({[key]: list[json.uuid][key]}))),
            type: listType,
            page: page,
            max: json.max,
            entities: MemoryRetrieveAll()
          });
        }).catch(error => {
          callbacks.error(error);
        });
    }
  } else {
    fetch(`/api/list/${listType}?from=${from}&to=${to}`)
      .then(response => response.json())
      .then(json => {
        LATEST_UUID[listType] = json.uuid;
        list[json.uuid] = Object.assign(list[json.uuid] || {}, json.items);
        LIST_MAX[listType] = json.max;
        MemoryStore(json.$entities);

        callbacks.complete({
          uuid: json.uuid,
          items: Object.assign({}, ...Object.keys(list[json.uuid])
                        .filter(key => key >= from && key <= to)
                        .map(key => ({[key]: list[json.uuid][key]}))),
          type: listType,
          page: page,
          max: json.max,
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