import {h, Component} from 'preact';
import {GetListApi} from '../core/api/list.js';
import withData from '../core/withData.hoc.js';
import ListView from './list-view.js';

export default function withListType(listType) {
  return class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        'from': 0,
        'to': 20,
        'listType': listType
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
}