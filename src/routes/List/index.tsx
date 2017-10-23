import {h, Component} from 'preact';
import WithData from 'components/WithData';
import List from 'components/List';

import {getList} from 'api/list';
import {RetrieveList} from 'api/types';
import {LIST_TYPES, List as ListType, ListPage, UUID} from '@kristoferbaxter/hn-api';

interface Props {
  matches: any;
  type: LIST_TYPES;
}
interface State {
  uuid: UUID;
}
export default class extends Component<Props, State> {
  render({matches, type}: Props, {uuid}: State): JSX.Element {
    const values: RetrieveList = {
      page: parseInt(matches.page || 1, 10),
      type,
      uuid,
    };

    return (
      <WithData
        source={getList}
        values={values}
        handleUUIDChange={this.handleUUIDChange}
        render={this.ListViewWithData}
      />
    );
  }

  private ListViewWithData = (data: ListType & ListPage): JSX.Element => {
    return <List data={data} />;
  };
  private handleUUIDChange = (uuid: UUID): void => {
    this.state.uuid = uuid;
  };
}
