let ENTITIES = {};

function MemoryRetrieve(item) {
  return ENTITIES[item];
}
function MemoryStore(items) {
  ENTITIES = Object.assign(ENTITIES, items);
}

//For debugging the Memory Store.
//if (typeof window !== 'undefined') {
//  window.peek = ENTITIES;
//}

export {
  MemoryRetrieve,
  MemoryStore
};