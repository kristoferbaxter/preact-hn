'use strict';

import {MemoryRetrieve, MemoryStore} from 'utils/memory';

/*
return {
  partial: function(),
  complete: function(),
  error: function()
}
*/
export default async ({root}, callbacks) => {
  // Fetch the missing values.
  try {
    const {$entities} = await (await fetch(`/api/comments/${root}`)).json();
    MemoryStore($entities);
    callbacks.complete($entities);
  } catch(error) {
    callbacks.error(error);
  }
}