import {Component} from 'preact';
import {ListCallback, CommentsCallback} from 'api/types';

interface Props {
  memory: (values: object) => ListCallback | CommentsCallback;
  network: (values: object) => Promise<ListCallback | CommentsCallback>;
  values: any;
  handleUUIDChange?: (newUuid: string) => void;
  render: (data: any, error: boolean) => JSX.Element;
}
interface State {
  data: any;
  complete: boolean;
  error: boolean;
}

export default class extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = props.memory(props.values);
  }

  componentWillReceiveProps({values, memory}) {
    this.state = memory(values);
    this.retrieve(values);
  }

  componentDidMount() {
    addEventListener('online', this.handleNetworkChange);
    this.retrieve(this.props.values);
  }
  componentWillUnmount() {
    removeEventListener('online', this.handleNetworkChange);
  }

  render({render: propRender}: Props, {data, error}: State): JSX.Element {
    return propRender(data, error);
  }

  private handleNetworkChange = (): void => {
    if (this.state.error && navigator.onLine) {
      this.state = Object.assign(this.state, {error: false, complete: false});
      this.retrieve(this.props.values);
    }
  };
  private retrieve = async function(values): Promise<void> {
    if (!this.state.complete) {
      const {data = null, error, complete} = await this.props.network(values);

      if (JSON.stringify(values) === JSON.stringify(this.props.values)) {
        this.setState({
          data: data || this.state.data,
          error,
          complete,
        });
      }
    }
  };
}
