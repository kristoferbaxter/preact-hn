import {h} from 'preact';
import objstr from 'obj-str';
import LoadingView from '../core/loadingView.js';
import ListItem from './item.js';
import {ITEMS_PER_PAGE} from './constants.js';

import styles from './list.css';

function Pagination({data: {page, max, type}}) {
  const maxPages = Math.ceil(parseInt(max, 10)/ITEMS_PER_PAGE);
  const parsedPage = parseInt(page, 10);

  return (
    <p class={styles.pagination}>
      <a href={`/${type}/${parsedPage-1}`} class={objstr({[styles.navigate]: true, [styles.disabled]: parsedPage <= 1})}>&lt; prev</a>
      <span class={styles.pages}>{page}/{maxPages}</span>
      <a href={`/${type}/${parsedPage+1}`} class={objstr({[styles.navigate]: true, [styles.disabled]: parsedPage >= maxPages})}>next &gt;</a>
    </p>
  );  
}

export default ({data}) => {
  if (!data || data === null) {
    return <LoadingView />;
  }

  const {items, $entities} = data;
  return (
    <main>
      <Pagination data={data} />
      {Object.keys(items).map(item => {
        const itemAsInt = parseInt(item, 10);
        return <ListItem index={itemAsInt+1} entity={$entities[items[itemAsInt]]} />;
      })}
    </main>
  );
}