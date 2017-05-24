import {h, Component} from 'preact';
import {GetListApi} from '../../core/api/list.js';
import withData from '../../core/withData.hoc.js';
import ListView from '../list.js';

export default class extends Component {
  constructor(props) {
    super(props);

    this.handleUUIDChange = this.handleUUIDChange.bind(this);
  }

  handleUUIDChange(uuid) {
    this.state.uuid = uuid;
  }
  componentWillReceiveProps() {
    this.state.uuid = null;
  }
  
  render({matches: {page=1}, listType}, {uuid}) {
    const ViewWithData = withData(ListView, {
      fetchDataFunction: GetListApi,
      properties: Object.assign({
        page: page,
        listType: listType
      }, uuid ? {uuid: uuid} : {})
    });

    return <ViewWithData handleUUIDChange={this.handleUUIDChange} />
  }
}