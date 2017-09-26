import {h, Component} from 'preact';
import {GetListApi} from '../../core/api/list.js';
import WithData from '../../core/withData.js';
import ListView from '../list.js';

export default class extends Component {
  constructor(props) {
    super(props);

    this.handleUUIDChange = this.handleUUIDChange.bind(this);
    this.ListViewWithData = this.ListViewWithData.bind(this);
  }
  
  handleUUIDChange(uuid) {
    this.state.uuid = uuid;
  }
  componentWillReceiveProps() {
    this.handleUUIDChange(null);
  }

  ListViewWithData(data) {
    return <ListView {...this.props} data={data} />;
  }
  
  render({matches, listType}, {uuid={}}) {
    const values = Object.assign({
      page: parseInt(matches.page || 1, 10),
      listType
    }, uuid);

    return <WithData source={GetListApi} values={values} handleUUIDChange={this.handleUUIDChange} render={this.ListViewWithData} />;
  }
}