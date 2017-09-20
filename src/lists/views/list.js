import {h, Component} from 'preact';
import {GetListApi} from '../../core/api/list.js';
import WithData from '../../core/withData.fcc.js';
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
  
  render(props, {uuid}) {
    const values = Object.assign({
      page: parseInt(props.matches.page || 1, 10),
      listType: props.listType
    }, uuid ? {uuid} : {});

    return (
      <WithData source={GetListApi} values={values} handleUUIDChange={this.handleUUIDChange}>
        { (data) => <ListView {...props} data={data} /> } 
      </WithData>
    );
  }
}