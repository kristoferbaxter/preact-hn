'use strict';

import {MemoryRetrieve, MemoryStore} from './memory.js';

/*
return {
  partial: function(),
  complete: function(),
  error: function()
}
*/
function GetComments({root}, callbacks) {
  // Fetch the missing values.
  fetch(`/api/comments/${root}`)
    .then(response => response.json())
    .then(function handleJson(json) {
      MemoryStore(json.$entities);

      //console.log(json.$entities);
      callbacks.complete(json.$entities);
    }).catch(function handleError(error) {
      callbacks.error(error);
    });
}

export {
  GetComments
};