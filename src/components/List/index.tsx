import {h} from 'preact';
import Pagination from 'components/Pagination';
import Loading from 'components/Loading';
import ListItem from 'components/ListItem';
import {ITEMS_PER_PAGE} from 'utils/constants';
import {PagedList} from 'api/api-types';

interface ListViewProps {
  data: PagedList;
}
export default function({data}: ListViewProps): JSX.Element {
  if (!data || data === null) {
    return <Loading />;
  }

  const {items, $entities, max, page, type} = data;
  return (
    <main>
      <Pagination page={page} maxPages={Math.ceil(max / ITEMS_PER_PAGE)} type={type} />
      {Object.keys(items).map(item => {
        const itemAsInt = Number(item);
        return <ListItem index={itemAsInt + 1} entity={$entities[items[itemAsInt]]} />;
      })}
    </main>
  );
}