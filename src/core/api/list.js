'use strict';

import {MemoryRetrieve, MemoryStore} from './memory.js';
import {ITEMS_PER_PAGE, LIST_TYPES} from '../../lists/constants.js';

let LATEST_UUID = {};
// Pre-populate based on how many list types are supported.
Object.keys(LIST_TYPES).forEach(function(list) {
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

function storeListData({uuid, items, max, type, $entities}) {
  MemoryStore(Object.assign({
    [uuid]: {
      items,
      max,
      type
    }
  }, $entities));
  setLatestUUID(type, uuid);  
}

function deriveResponse({type, to, from, page}, json) {
  const {current: {uuid, items, max, $entities}} = json;
  const stored = MemoryRetrieve(uuid);

  storeListData({uuid, items: Object.assign(stored && stored.items || {}, items), max, type, $entities});

  return {
    current: {
      uuid,
      items: Object.assign({}, ...Object.keys(items)
        .filter(key => key >= from && key <= to)
        .map(key => ({[key]: items[key]}))),
      type,
      page,
      max,
      $entities
    }
  };
}

function deriveStoredResponse(uuid, list, page) {
  const {from, to} = determineListRange(page);
  // The memory store has data for this uuid, filter the data for the range requested (from->to).
  const cachedKeys = Object.keys(list.items).filter(itemOrder => itemOrder >= from && itemOrder <= to);

  // Create a copy of the data for the range we have in-memory.
  // This allows the UI to have at least a partial response.
  let cachedItems = {};
  let cachedEntities = {}
  cachedKeys.forEach((key) => {
    const entityId = list.items[key];
    cachedItems[key] = entityId;
    cachedEntities[entityId] = MemoryRetrieve(entityId);
  });
  
  return {
    cachedKeys,
    response: {
      uuid,
      items: cachedItems,
      type: list.type,
      page,
      max: list.max,
      $entities: cachedEntities   
    }
  };
}

function setLatestUUID(type, uuid) {
  LATEST_UUID[type] = uuid;
}

/*
return {
  partial: function(),
  complete: function(),
  error: function()
}
*/
function GetListApi({listType, page=1, previousPage, uuid=LATEST_UUID[listType]}, callbacks) {
  console.log('getListApi');
  
  const list = MemoryRetrieve(uuid);
  const {from, to} = determineListRange(page);
  let fetchUrl = `/api/list/${listType}?from=${from}&to=${to}`;
  let storedResponse = {};

  if (uuid && list) {
    // determine previous page items
    if (previousPage) {
      storedResponse.previous = deriveStoredResponse(uuid, list, previousPage).response;
    }

    // determine current page items
    const currentPageResponse = deriveStoredResponse(uuid, list, page);
    storedResponse.current = currentPageResponse.response;
    if (currentPageResponse.cachedKeys.length >= ITEMS_PER_PAGE) {
      // If the filtered items (only ones within the range of from->to) 
      // has a length equal to the length between from and to...
      // then all the items are present in the cachedKeys.
      callbacks.complete(storedResponse);
      return;
    } else {
      // Give the UI the partial response before we fetch the remainder.
      callbacks.partial(storedResponse);

      // Change the fetch url to include the active UUID.
      // This means we will get results for a known uuid.
      fetchUrl = `/api/list/${listType}?uuid=${uuid}&from=${from}&to=${to}`;
    }
  }

  fetch(fetchUrl)
  .then(response => response.json())
  .then(json => callbacks.complete(deriveResponse({type: listType, to, from, page}, json)))
  .catch(error => callbacks.error(error));
}

export {
  GetListApi,
  determineListRange,
  setLatestUUID,
  storeListData
};