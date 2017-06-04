import {h} from 'preact';
import objstr from 'obj-str';
import LoadingView from '../core/loadingView.js';
import ListItem from './item.js';
import {ITEMS_PER_PAGE} from './constants.js';

import styles from './list.css';

function Pagination({data: {current: {page, max, type}}}) {
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
  console.log('list', data);
  /*
  if (!data || data === null) {
    return <LoadingView />;
  }
  */
  const {
    current: {items, $entities, page}
  } = data;

  console.log('l2', data.previous, page, data.previous !== undefined && (page > data.previous.page), data.previous !== undefined && (page < data.previous.page));

  const previousListClasses = objstr({
    [styles.previousList]: true,
    [styles.animateList]: true,
    [styles.animatePreviousForward]: data.previous !== undefined && (page > data.previous.page),
    [styles.animatePreviousBackward]: data.previous !== undefined && (page < data.previous.page)
  });
  const currentListClasses = objstr({
    [styles.animateList]: data.previous !== undefined,
    [styles.animateForward]: data.previous !== undefined && (page > data.previous.page),
    [styles.animateBackward]: data.previous !== undefined && (page < data.previous.page)
  });
  return (
    <main style='position: relative'>
      <Pagination data={data} />
      {data.previous && data.previous.items && <div class={previousListClasses} aria-role="presentation">
        {Object.keys(data.previous.items).map(item => {
          const itemAsInt = parseInt(item, 10);
          return <ListItem index={itemAsInt+1} entity={data.previous.$entities[data.previous.items[itemAsInt]]} />;
        })}
      </div>}
      <div class={currentListClasses}>
        {Object.keys(items).map(item => {
          const itemAsInt = parseInt(item, 10);
          return <ListItem index={itemAsInt+1} entity={$entities[items[itemAsInt]]} />;
        })}
      </div>
    </main>
  );
}