import {h, Component} from 'preact';
import Header from '../header/header.js';
import LoadingView from './loadingView.js';

import styles from './routedView.css';

export default class RoutedView extends Component {
  constructor(props, context) {
    super(props, context);

    this.lazyLoadedRoutes = {};
  }

  loader() {
    const {load, path, delay=200} = this.props;
    let timeout = null;

    if (delay > 0) {
      timeout = setTimeout(() => {
        this.setState({
          pastDelay: true
        });
      }, delay);
    }

    if (load) {
      load((file) => {
        timeout && clearTimeout(timeout);
        this.setState({
          child: file.default
        }, () => {
          this.lazyLoadedRoutes[path] = file.default;
        });
      });
    }
  }
  
  componentWillMount() {
    this.loader();
  }

  componentWillReceiveProps({path}) {
    if (this.props.path !== path) {
      let nextChild = this.lazyLoadedRoutes[path];

      this.setState({
        child: nextChild
      }, () => {
        nextChild === undefined && this.loader();
      });
    }
  }

  render(props, {child, pastDelay}) {
    this.context.url=props.url;

    const usableChild = props.child || child || null;
    return (
      <div id="mount" class={styles.viewHasHeader}>
        <Header />
        <div class={styles.mainView}>
          {usableChild ? h(usableChild, props) : (pastDelay || props.delay === 0 ? (props.children || <LoadingView />) : null)}
        </div>
      </div>
    );
  }
}