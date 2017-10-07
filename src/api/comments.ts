import {Comments, CommentRetrieve, CommentCallbacks} from './api-types';

export default async ({root}: CommentRetrieve, callbacks: CommentCallbacks): Promise<void> => {
  // Fetch the missing values.
  try {
    const {$entities}: Comments = await (await fetch(`/api/comments/${root}`)).json();
    callbacks.complete($entities);
  } catch (error) {
    callbacks.error(error);
  }
};
