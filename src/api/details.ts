import {MemoryRetrieve, MemoryStore} from 'utils/memory';
import {Details, FeedItem} from '@kristoferbaxter/hn-api';
import {RetrieveComments, CommentCallbacks, Comments} from './types';

/*
 * When requesting a details page, we can use the data from a FeedItem to render instantly (if the user already populated this entity).
 * 
 * However, a FeedItem contains a subset of the Details object.
 * 
 * Details must always be requested as well, so we maintain the freshest comments content on the view upon re-entry.
 */
export default async ({root}: RetrieveComments, callbacks: CommentCallbacks): Promise<void> => {
  const entity: FeedItem | Details = MemoryRetrieve(root);
  if (entity) {
    callbacks.partial(entity);
  }

  try {
    const {$entities}: Comments = await (await fetch(`/api/details/${root}`)).json();
    MemoryStore($entities);
    callbacks.complete($entities[root]);
  } catch (error) {
    callbacks.error(error);
  }
};
