import {h, Component} from 'preact';
import {GetListApi} from '../../core/api/list.js';
import withData from '../../core/withData.hoc.js';
import ListView from '../list.js';

export default class extends Component {
  constructor(props) {
    super(props);

    this.handleUUIDChange = this.handleUUIDChange.bind(this);
    this.previousPage = null;
  }

  handleUUIDChange(uuid) {
    this.state.uuid = uuid;
  }
  componentWillReceiveProps() {
    this.state.uuid = null;
    if (!IS_SERVER) {
      this.previousPage = parseInt(this.props.page, 10);
    }
  }
  
  render({matches: {page=1}, listType}, {uuid}) {
    const ViewWithData = withData(ListView, {
      fetchDataFunction: GetListApi,
      properties: Object.assign({
        page: parseInt(page, 10),
        previousPage: this.previousPage,
        listType: listType
      }, uuid ? {uuid: uuid} : {})
    });

    return <ViewWithData handleUUIDChange={this.handleUUIDChange} previousPage={this.previousPage} />
  }
}