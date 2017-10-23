import {Component} from 'preact';

interface APICallbacks {
  partial: (data: any) => void;
  complete: (data: any) => void;
  error: (error: any) => void;
}
interface Props {
  source: (values: any, callbacks: APICallbacks) => void;
  values: any;
  handleUUIDChange?: (newUuid: string) => void;
  render: (data: any, error: boolean) => JSX.Element;
}
interface State {
  data: any;
  error: boolean;
}
export default class extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      error: false,
    };
  }

  componentWillMount() {
    this.retrieve(this.props.values);
  }
  componentWillReceiveProps({values}) {
    this.state.data = null;
    this.retrieve(values);
  }

  componentDidMount() {
    addEventListener('online', this.handleNetworkChange);
  }
  componentWillUnmount() {
    removeEventListener('online', this.handleNetworkChange);
  }

  render({render: propRender}: Props, {data, error}: State): JSX.Element {
    return propRender(data, error);
  }

  private handlePartialData = (partialData): void => {
    this.setState({
      data: partialData,
    });
  };
  private handleCompleteData = (completeData): void => {
    if (this.props.values.uuid !== completeData.uuid) {
      this.props.handleUUIDChange(completeData.uuid);
    }
    this.setState({
      data: completeData,
    });
  };
  private handleErrorData = (error): void => {
    this.setState({
      error: true,
    });
  };

  private handleNetworkChange = (): void => {
    if (this.state.error && navigator.onLine) {
      this.state.error = false;
      this.retrieve(this.props.values);
    }
  };
  private retrieve = (values): void => {
    this.props.source(values, {
      partial: this.handlePartialData,
      complete: this.handleCompleteData,
      error: this.handleErrorData,
    });
  };
}
