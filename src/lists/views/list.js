import {h, Component} from 'preact';
import {GetListApi} from '../../core/api/list.js';
import withData from '../../core/withData.hoc.js';
import ListView from '../list.js';

const ITEMS_PER_PAGE = 20;

export default class ListHome extends Component {
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
        from: page ? ((page-1) * ITEMS_PER_PAGE) : 0,
        to: page ? (((page-1) * ITEMS_PER_PAGE) + 20) : 20,
        listType: listType
      }, uuid ? {uuid: uuid} : {})
    });

    return <ViewWithData handleUUIDChange={this.handleUUIDChange} />
  }
}