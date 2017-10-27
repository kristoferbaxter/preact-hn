import {MemoryRetrieve, MemoryStore} from 'utils/memory';
import {RetrieveComments, ResponseComments, CommentsCallback} from './types';

/*
 * When requesting a details page, we can use the data from a FeedItem to render instantly 
 * (if the user already populated this entity).
 * 
 * However, a FeedItem contains a subset of the Details object.
 * 
 * Details must always be requested as well, so we maintain the freshest comments 
 * content on the view upon re-entry.
 */

export function memory(values: RetrieveComments): CommentsCallback {
  return {
    values,
    error: false,
    data: MemoryRetrieve(values.root) || null,
    complete: false,
  };
}
export async function network(values: RetrieveComments): Promise<CommentsCallback> {
  try {
    const {root} = values;
    const {$entities}: ResponseComments = await (await fetch(`/api/details/${root}`)).json();

    MemoryStore($entities);
    return {
      values,
      error: false,
      data: $entities[root],
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
