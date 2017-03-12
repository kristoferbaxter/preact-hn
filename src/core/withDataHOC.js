import {h, Component} from 'preact';

// This is a Higher Order Component.
// DataComponent(WrappedComponent, { method, properties })
export default function withData(WrappedComponent, {fetchDataFunction, properties}) {
  return class extends Component {
    constructor(props) {
      super(props);
      
      this.state = {
        data: {}
      };

      this.handlePartialData = this.handlePartialData.bind(this);
      this.handleCompleteData = this.handleCompleteData.bind(this);
      this.handleErrorData = this.handleErrorData.bind(this);  
    }

    handlePartialData(partialData) {
      console.log('partial', partialData);
      this.setState({
        data: partialData
      });
    }
    handleCompleteData(completeData) {
      console.log('complete', completeData);
      this.setState({
        data: completeData
      });
    }
    handleErrorData(error) {
      console.log('error', error);
      // TODO: Handle Errors better!
    }

    componentWillMount() {
      fetchDataFunction(properties, {
        partial: this.handlePartialData,
        complete: this.handleCompleteData,
        error: this.handleErrorData  
      })
    }

    render(props, {data}) {
      return <WrappedComponent data={data} {...props} />;
    }
  }
}