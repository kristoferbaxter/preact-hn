let ENTITIES = {};

export function MemoryRetrieve(item: string | number): any {
  return ENTITIES[item];
}
export function MemoryStore(items: object): void {
  ENTITIES = Object.assign(ENTITIES, items);
}

//For debugging the Memory Store.
// if (typeof window !== 'undefined') {
//   (window as any).peek = ENTITIES;
// }
