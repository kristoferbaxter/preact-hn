import {Details, FeedItem, NumberToFeedItem, ListPage, LIST_TYPES, UUID, List} from '@kristoferbaxter/hn-api';

// Comments Browser API
export interface RetrieveComments {
  root: Details['id'];
}
export interface Comments {
  $entities: Details;
}
export interface CommentCallbacks {
  partial: (partialComments: Details | FeedItem) => void;
  complete: (completeComments: Details) => void;
  error: (error: any) => void;
}

// Items Browser API
export interface RetrieveItems {
  keys: FeedItem['id'][];
}
export interface Items {
  $entities: Map<FeedItem['id'], FeedItem>;
}
export interface ItemsCallbacks {
  partial: (partialItems: NumberToFeedItem) => void;
  complete: (completeItems: NumberToFeedItem) => void;
  error: (error: any) => void;
}

// List Browser API
export interface RetrieveList extends ListPage {
  type: LIST_TYPES;
  uuid: UUID;
}
export interface ListCallbacks {
  partial: (partialList: List & ListPage) => void;
  complete: (completelist: List & ListPage) => void;
  error: (error: any) => void;
}
