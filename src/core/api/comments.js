'use strict';

import {MemoryRetrieve, MemoryStore} from './memory.js';

/*
return {
  partial: function(),
  complete: function(),
  error: function()
}
*/
export default function({root}, callbacks) {
  // Fetch the missing values.
  fetch(`/api/comments/${root}`)
  .then(response => response.json())
  .then((json) => {
    MemoryStore(json.$entities);
    callbacks.complete(json.$entities);
  }).catch((error) => {
    callbacks.error(error);
  });
}