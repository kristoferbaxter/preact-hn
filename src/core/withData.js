import {h, Component} from 'preact';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      error: false
    };
    this.handlePartialData = this.handlePartialData.bind(this);
    this.handleCompleteData = this.handleCompleteData.bind(this);
    this.handleErrorData = this.handleErrorData.bind(this);
    this.handleNetworkChange = this.handleNetworkChange.bind(this);
    this.retrieve = this.retrieve.bind(this);
  }

  handlePartialData(partialData) {
    this.setState({
      data: partialData
    });
  }
  handleCompleteData(completeData) {
    if (this.props.values.uuid !== completeData.uuid) {
      this.props.handleUUIDChange(completeData.uuid);
    }
    this.setState({
      data: completeData
    });
  }
  handleErrorData(error) {
    this.setState({
      error: true
    });
  }

  retrieve(values) {
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

  handleNetworkChange() {
    if (this.state.error && navigator.onLine) {
      this.state.error = false;
      this.retrieve(this.props.values);
    }
  }
  componentDidMount() {
    window.addEventListener('online', this.handleNetworkChange);
  }
  componentWillUnmount() {
    window.removeEventListener('online', this.handleNetworkChange);
  }

  render({render: propRender}, {data, error}) {
    return propRender(data, error);
  }
}