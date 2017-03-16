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
    const {load, name, delay=DELAY} = this.props;

    let timeout = setTimeout(() => {
      this.setState({
        pastDelay: true
      });
    }, delay);

    if (load) {
      load((file) => {
        clearTimeout(timeout);
        this.setState({
          child: file.default
        }, function() {
          this.lazyLoadedRoutes[name] = file.default;
        }.bind(this));
      });
    }
  }
  
  componentWillMount() {
    this.loader();
  }

  componentWillReceiveProps({name}) {
    if (this.props.name !== name) {
      let nextChild = this.lazyLoadedRoutes[name];

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

    const viewClasses = {
      [styles.view]: true,
      [styles.viewHasHeader]: true
    };

    return (
      <div class={viewClasses}>
        <Header />
        <div className={styles.mainView}>
          {child ? h(child, props) : (pastDelay || props.delay === 0 ? props.children : null)}
        </div>
      </div>
    );
  }
}