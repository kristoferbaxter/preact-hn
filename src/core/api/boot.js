import {MemoryStore} from './memory.js';
import {setLatestUUID} from './list.js';

(() => {
  const {uuid, items, $entities, max, type} = window.seed;

  MemoryStore({
    [uuid]: {
      items,
      max,
      type
    }
  });
  MemoryStore($entities);
  setLatestUUID(type, uuid);
})();