import {h} from 'preact';
import formatTime from 'utils/time';

import styles from './styles.css';

export default function({index, entity}): JSX.Element {
  if (!entity) return null;

  const {url, title, score, by, time, descendants, id} = entity;
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
          {score} points by{' '}
          <a href={`/user/${by}`} class={styles.link}>
            {by}
          </a>{' '}
          {formatTime(time)} ago
          <a href={`/item/${id}`} class={styles.commentCount}>
            {descendants > 1 ? `${descendants} comments` : 'discuss'}
          </a>
        </p>
      </div>
    </article>
  );
}
