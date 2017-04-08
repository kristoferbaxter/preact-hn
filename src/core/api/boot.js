import {MemoryStore} from './memory.js';
import {setLatestUUID} from './list.js';

if (window.seed !== undefined) {
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
}