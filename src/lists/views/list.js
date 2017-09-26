import {h, Component} from 'preact';
import {GetListApi} from '../../core/api/list.js';
import WithData from '../../core/withData.js';
import ListView from '../list.js';

export default class extends Component {
  ListViewWithData = data => <ListView {...this.props} data={data} />;
  handleUUIDChange = uuid => this.state.uuid = uuid;
  componentWillReceiveProps() {
    this.handleUUIDChange(null);
  }
  
  render({matches, listType}, {uuid={}}) {
    const values = Object.assign({
      page: parseInt(matches.page || 1, 10),
      listType
    }, uuid);

    return <WithData source={GetListApi} values={values} handleUUIDChange={this.handleUUIDChange} render={this.ListViewWithData} />;
  }
}