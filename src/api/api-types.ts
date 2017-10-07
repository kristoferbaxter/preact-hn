import {LIST_TYPES} from 'utils/constants';

export type uuid = string;
export type EntityId = number;
export type EntityType = 'job' | 'story' | 'comment' | 'poll' | 'pollopt';
export type EntityItemMap = Map<number, EntityId> | {};
export type EntityMap = Map<EntityId, Entity> | {};

export interface Entity {
  by: string;
  descendants: number;
  id: EntityId;
  kids: EntityId[];
  score: number;
  title: string;
  type: EntityType;
  url: string;
}

/* LIST */
export interface ListRange {
  from: number;
  to: number;
}
export interface List {
  uuid: uuid;
  items: EntityItemMap;
  type: string;
  max: number;
  $entities: EntityMap;
}
export interface PagedList extends List {
  page: number;
}

export interface ListRetrieve {
  listType: LIST_TYPES;
  page: number;
  uuid?: uuid;
}
export interface ListCallbacks {
  partial: (partialList: PagedList) => void;
  complete: (completeList: PagedList) => void;
  error: (error: any) => void;
}

/* COMMENTS */
export interface Comment {
  [key: number]: CommentChildren;
  id: EntityId;
  $sentinel?: boolean;
}
export type CommentChildren = Map<number, Comment>;
export interface Comments {
  $entities: EntityMap;
  comments: Comment;
}

export interface CommentRetrieve {
  root: EntityId;
}
export interface CommentCallbacks {
  partial: (partialComments: EntityMap) => void;
  complete: (completeComments: EntityMap) => void;
  error: (error: any) => void;
}

/* ITEMS */
export interface Items {
  $entities: EntityMap;
}

export interface ItemsRetrieve {
  keys: EntityId[];
}
export interface ItemsCallbacks {
  partial: (partialItems: EntityMap) => void;
  complete: (completeItems: EntityMap) => void;
  error: (error: any) => void;
}
