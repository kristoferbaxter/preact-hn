import {MemoryRetrieve, MemoryStore} from 'utils/memory';
import {Items, EntityMap, ItemsRetrieve, ItemsCallbacks} from './api-types';

export default async ({keys}: ItemsRetrieve, callbacks: ItemsCallbacks): Promise<void> => {
  // Keys are from entities table.
  let resolved: EntityMap = {};
  let anyResolved: boolean;
  let unresolved: EntityMap = {};
  let anyUnresolved: boolean;

  keys.forEach(key => {
    const entity = MemoryRetrieve(key);

    if (entity) {
      resolved[key] = entity;
      anyResolved = true;
    } else {
      unresolved[key] = null;
      anyUnresolved = true;
    }
  });

  if (anyResolved) {
    if (anyUnresolved) {
      callbacks.partial(resolved);
    } else {
      callbacks.complete(resolved);
      return;
    }
  }

  try {
    const {$entities}: Items = await (await fetch(
      `/api/items?items=${JSON.stringify(Object.keys(unresolved))}`,
    )).json();
    MemoryStore($entities);
    callbacks.complete(Object.assign(resolved, $entities));
  } catch (error) {
    callbacks.error(error);
  }
};
