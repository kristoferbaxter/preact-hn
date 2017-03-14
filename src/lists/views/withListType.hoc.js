import {h, Component} from 'preact';
import {GetListApi} from '../../core/api/list.js';
import withData from '../../core/withData.hoc.js';
import ListView from '../list.js';

export default function withListType(listType) {
  return class extends Component {
    constructor(props) {
      super(props);

      // Will begin to derive from/to from url
      // /top/2, etc
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
    render({fetchDataFunction}) {
      const ViewWithData = withData(ListView, {
        fetchDataFunction: fetchDataFunction || GetListApi,
        properties: this.state
      });

      return <ViewWithData handleUUIDChange={this.handleUUIDChange} />
    }
  }
}