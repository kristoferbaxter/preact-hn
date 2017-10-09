import {h} from 'preact';
import objstr from 'obj-str';

import styles from './styles.css';

interface Props {
  page: number;
  maxPages: number;
  type: string;
}
export default ({page, maxPages, type}: Props): JSX.Element => (
  <p class={styles.pagination}>
    <a href={`/${type}/${page - 1}`} class={objstr({[styles.navigate]: true, [styles.disabled]: page <= 1})}>
      &lt; prev
    </a>
    <span class={styles.pages}>
      {page}/{maxPages}
    </span>
    <a href={`/${type}/${page + 1}`} class={objstr({[styles.navigate]: true, [styles.disabled]: page >= maxPages})}>
      next &gt;
    </a>
  </p>
);
