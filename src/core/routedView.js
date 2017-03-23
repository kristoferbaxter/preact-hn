import {h, Component} from 'preact';

import Header from '../header/header.js';

const DELAY = 200;
import styles from './routedView.css';

export default class RoutedView extends Component {
  constructor(props, context) {
    super(props, context);

    this.logger = props.logger ? props.logger : console.log;
    this.lazyLoadedRoutes = {};
  }

  loader() {
    const {load, path, delay=DELAY} = this.props;
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
        }, function() {
          this.lazyLoadedRoutes[path] = file.default;
        }.bind(this));
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
      }, function() {
        nextChild === undefined ? this.loader() : null;
      });
    }
  }

  render(props, {child, pastDelay}) {
    this.context = Object.assign(this.context, {
      url: props.url,
      logger: this.logger
    });

    const renderChild = props.child || child || null;
    return (
      <div class={styles.viewHasHeader}>
        <Header />
        <div class={styles.mainView}>
          {renderChild ? h(renderChild, props) : (pastDelay || props.delay === 0 ? props.children : null)}
        </div>
      </div>
    );
  }
}