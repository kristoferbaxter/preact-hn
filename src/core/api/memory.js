'use strict';

let ENTITIES = {};

function MemoryRetrieve(item) {
  return ENTITIES[item];
}
function MemoryRetrieveAll() {
  return ENTITIES;
}
function MemoryStore(items) {
  ENTITIES = Object.assign(ENTITIES, items);
}

export {
  MemoryRetrieve,
  MemoryRetrieveAll,
  MemoryStore
};