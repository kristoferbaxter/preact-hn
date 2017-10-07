import {h, Component} from 'preact';
import WithData from 'components/WithData';
import Pagination from 'components/Pagination';
import Loading from 'components/Loading';
import ListItem from 'components/ListItem';

import {getList} from 'api/list';
import {ITEMS_PER_PAGE} from 'utils/constants';

interface ListViewProps {
  data: any;
}
function ListView({data}: ListViewProps): JSX.Element {
  if (!data || data === null) {
    return <Loading />;
  }

  const {items, $entities, max, page, type} = data;
  return (
    <main>
      <Pagination page={parseInt(page, 10)} maxPages={Math.ceil(parseInt(max, 10) / ITEMS_PER_PAGE)} type={type} />
      {Object.keys(items).map(item => {
        const itemAsInt = parseInt(item, 10);
        return <ListItem index={itemAsInt + 1} entity={$entities[items[itemAsInt]]} />;
      })}
    </main>
  );
}

interface Props {
  matches: any;
  listType: string;
}
interface State {
  uuid: string;
}
export default class extends Component<Props, State> {
  componentWillReceiveProps() {
    this.handleUUIDChange(null);
  }

  render({matches, listType}: Props, {uuid = {}}: State): JSX.Element {
    const values = Object.assign(
      {
        page: parseInt(matches.page || 1, 10),
        listType,
      },
      uuid,
    );

    return (
      <WithData
        source={getList}
        values={values}
        handleUUIDChange={this.handleUUIDChange}
        render={this.ListViewWithData}
      />
    );
  }

  private ListViewWithData(data): JSX.Element {
    return <ListView data={data} />;
  };
  private handleUUIDChange(uuid): void {
    this.state.uuid = uuid;
  };
}
