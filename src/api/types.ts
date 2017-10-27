import {Details, ListPage, LIST_TYPES, UUID, List} from '@kristoferbaxter/hn-api';

interface CallbackData {
  values: object; // Calling values so caller can disambiguate.
  error: boolean;
  complete: boolean;
}

// Comments Browser API
export interface RetrieveComments {
  root: Details['id'];
}
export interface ResponseComments {
  $entities: Details;
}
export interface CommentsCallback extends CallbackData {
  data?: Details;
}

// List Browser API
export interface RetrieveList extends ListPage {
  type: LIST_TYPES;
  uuid: UUID;
}
export interface ListCallback extends CallbackData {
  data?: List & ListPage;
}
