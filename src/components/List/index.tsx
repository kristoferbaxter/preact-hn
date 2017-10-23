import {h} from 'preact';
import Pagination from 'components/Pagination';
import Loading from 'components/Loading';
import ListItem from 'components/ListItem';
import {ITEMS_PER_PAGE} from '@kristoferbaxter/hn-api/lib/constants';
import {List, ListPage, FeedItem} from '@kristoferbaxter/hn-api';

import styles from './styles.css';

interface ListViewProps {
  data: List & ListPage;
}
export default function({data = null}: ListViewProps): JSX.Element {
  if (data === null) {
    return <Loading />;
  }

  const {items, $entities, max, page, type} = data;
  const itemKeys = Object.keys(items);
  return (
    <main class={styles.list}>
      <Pagination page={page} maxPages={Math.ceil(max / ITEMS_PER_PAGE)} type={type} />
      {itemKeys.length === 0 && <Loading />}
      {itemKeys.map(itemKey => {
        const keyNumber = Number(itemKey);
        return <ListItem index={keyNumber + 1} entity={$entities[items[keyNumber]] as FeedItem} />;
      })}
    </main>
  );
}
