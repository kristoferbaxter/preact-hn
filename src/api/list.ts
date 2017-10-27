'use strict';

import {MemoryRetrieve, MemoryStore} from 'utils/memory';
import {listRange} from '@kristoferbaxter/hn-api/lib/utilities';
import {UUID, ListRange, List, ListPage, NumberToFeedItemId, NumberToFeedItem, FeedItem} from '@kristoferbaxter/hn-api';
import {RetrieveList, ListCallback} from './types';

let LATEST_UUID: UUID;

export function storeList({uuid, items, max, type, $entities}: List): void {
  MemoryStore(
    Object.assign(
      {
        [`${uuid} ${type}`]: {
          items,
          max,
          type,
        },
      },
      $entities,
    ),
  );
  setLatestUUID(uuid);
}

function deriveResponse(
  {to, from, page}: ListRange & ListPage,
  {type, uuid, items, max, $entities}: List,
): List & ListPage {
  const stored = MemoryRetrieve(`${uuid} ${type}`);

  storeList({
    uuid,
    items: Object.assign((stored && stored.items) || {}, items),
    max,
    type,
    $entities,
  });

  return {
    uuid,
    items: Object.assign(
      {},
      ...Object.keys(items)
        .filter(key => Number(key) >= from && Number(key) <= to)
        .map(key => ({[key]: items[key]})),
    ),
    type,
    page,
    max,
    $entities,
  };
}

export function setLatestUUID(uuid): void {
  LATEST_UUID = uuid;

  if (ALLOW_OFFLINE) {
    // Fire and forget a message to the service worker informing it of a new UUID.
    const {controller} = navigator.serviceWorker;
    controller &&
      controller.postMessage({
        command: 'uuid-update',
        uuid: uuid,
      });
    localStorage.setItem('uuid', uuid);
  }
}

export function memory(values: RetrieveList): ListCallback {
  const {page = 1, uuid = LATEST_UUID} = values;
  const {from, to}: ListRange = listRange(page);
  const list: List = (uuid && (MemoryRetrieve(`${uuid} ${values.type}`) as List)) || null;

  let cached: number = 0;
  if (list !== null) {
    // Create a copy of the data for the range we have in-memory.
    // This allows the UI to have at least a partial response.
    let items: NumberToFeedItemId = {};
    let $entities: NumberToFeedItem = {};
    for (const key in list.items) {
      const keyAsNumber = Number(key);
      if (keyAsNumber > to) {
        break;
      } else if (keyAsNumber >= from && keyAsNumber <= to) {
        const entityId: FeedItem['id'] = list.items[key];
        items[key] = entityId;
        $entities[entityId] = MemoryRetrieve(entityId);
        cached++;
      }
    }

    return {
      values,
      complete: cached >= to - from,
      error: false,
      data: {
        uuid,
        items,
        type: list.type,
        page: Number(page),
        max: Number(list.max),
        $entities,
      },
    };
  }

  return {
    values,
    complete: false,
    error: false,
  };
}

export async function network(values: RetrieveList): Promise<ListCallback> {
  try {
    const {page = 1, uuid = LATEST_UUID} = values;
    const {from, to}: ListRange = listRange(page);

    const json: List = await (await fetch(
      `/api/list/${values.type}?${uuid ? `uuid=${uuid}&` : ''}from=${from}&to=${to}`,
    )).json();
    return {
      values,
      data: deriveResponse({to, from, page}, json),
      error: false,
      complete: true,
    };
  } catch (error) {
    return {
      values,
      error: true,
      complete: true,
    };
  }
}
