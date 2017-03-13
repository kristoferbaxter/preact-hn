import {h, Component} from 'preact';
import {GetListApi, LIST_TYPES} from '../core/api/list.js';
import withData from '../core/withDataHOC.js';
import ListView from './list.js';

export default class TopHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      from: 0,
      to: 20,
      listType: LIST_TYPES.top
    };

    this.handleUUIDChange = this.handleUUIDChange.bind(this);
  }

  handleUUIDChange(uuid) {
    this.state.uuid = uuid;
  }
  render() {
    const ViewWithData = withData(ListView, {
      fetchDataFunction: GetListApi,
      properties: this.state
    });

    return <ViewWithData handleUUIDChange={this.handleUUIDChange} />
  }
}