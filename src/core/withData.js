import {h, Component} from 'preact';

export default class extends Component {
  state = {
    data: null
  };

  handlePartialData = partialData => {
    this.setState({
      data: partialData
    });
  }
  handleCompleteData = completeData => {
    if (this.props.values.uuid !== completeData.uuid) {
      this.props.handleUUIDChange(completeData.uuid);
    }
    this.setState({
      data: completeData
    });
  }
  handleErrorData = error => {
    // TODO: Handle Errors better!
  }

  retrieve = values => {
    this.props.source(values, {
      partial: this.handlePartialData,
      complete: this.handleCompleteData,
      error: this.handleErrorData  
    });  
  }
  componentWillMount() {
    this.retrieve(this.props.values);
  }
  componentWillReceiveProps({values}) {
    this.state.data = null;
    this.retrieve(values);
  }

  render = ({render: propRender}, {data}) => propRender(data);
}