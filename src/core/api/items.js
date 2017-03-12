'use strict';

import {MemoryRetrieve, MemoryStore} from './memory.js';

/*
return {
  partial: function(),
  complete: function(),
  error: function()
}
*/
function GetItems({keys}, callbacks) {
  // Keys are from entities table.
  let resolved = {};
  let anyResolved = false;
  let unresolved = {};
  let anyUnresolved = false;

  keys.forEach(function(key) {
    const entity = MemoryRetrieve(key);

    if (entity) {
      resolved[key] = entity;
      anyResolved = true;
    } else {
      unresolved[key] = null;
      anyUnresolved = true;
    }
  });

  if (anyResolved) {
    if (anyUnresolved) {
      callbacks.partial(resolved);
    } else {
      callbacks.complete(resolved);
    }
  }

  if (anyUnresolved) {
    // Fetch the missing values.
    fetch(`/api/items?items=${JSON.stringify(Object.keys(unresolved))}`)
      .then(response => response.json())
      .then(function handleJson(json) {
        MemoryStore(json.$entities);

        callbacks.complete(Object.assign(resolved, json.$entities));
      }).catch(function handleError(error) {
        callbacks.error(error);
      });
  }
}

export {
  GetItems
};