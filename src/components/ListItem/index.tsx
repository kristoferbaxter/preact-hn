import {h} from 'preact';
import formatTime from 'utils/time';
import {FeedItem} from '@kristoferbaxter/hn-api';

import styles from './styles.css';

interface Props {
  index: number;
  entity: FeedItem;
}
export default function({index, entity}: Props): JSX.Element {
  if (!entity) return null;

  const {url, title, points, user, time, comments_count, id} = entity;
  return (
    <article class={styles.article}>
      <span class={styles.index}>{index}</span>
      <div class={styles.metadata}>
        <h2>
          <a href={url} class={styles.outboundLink}>
            {title}
          </a>
        </h2>
        <p>
          {points} points by{' '}
          <a href={`/user/${user}`} class={styles.link}>
            {user}
          </a>{' '}
          {formatTime(time)}
          <a href={`/item/${id}`} class={styles.commentCount}>
            {comments_count === 0 ? 'discuss' : `${comments_count} comment${comments_count > 1 ? 's' : ''}`}
          </a>
        </p>
      </div>
    </article>
  );
}
