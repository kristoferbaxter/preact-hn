import {MemoryStore} from './memory.js';
import {setUUID} from './list.js';

(() => {
  const {uuid, items, entities} = window.seed;

  MemoryStore({[uuid]: items});
  MemoryStore(entities);
  setUUID('top', uuid);
})();