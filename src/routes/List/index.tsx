import {h, Component} from 'preact';
import WithData from 'components/WithData';
import List from 'components/List';

import {getList} from 'api/list';
import {ListRetrieve, PagedList, uuid} from 'api/api-types';
import {LIST_TYPES} from 'utils/constants';

interface Props {
  matches: any;
  listType: LIST_TYPES;
}
interface State {
  uuid: uuid;
}
export default class extends Component<Props, State> {
  componentWillReceiveProps() {
    this.handleUUIDChange(null);
  }

  render({matches, listType}: Props, {uuid = {}}: State): JSX.Element {
    const values: ListRetrieve = Object.assign(
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

  private ListViewWithData(data: PagedList): JSX.Element {
    return <List data={data} />;
  };
  private handleUUIDChange(uuid: uuid): void {
    this.state.uuid = uuid;
  };
}
