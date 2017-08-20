let ENTITIES = {};

export function MemoryRetrieve(item) {
  return ENTITIES[item];
}
export function MemoryStore(items) {
  ENTITIES = Object.assign(ENTITIES, items);
}

//For debugging the Memory Store.
//if (typeof window !== 'undefined') {
//  window.peek = ENTITIES;
//}