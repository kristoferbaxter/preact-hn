import {h, Component} from 'preact';
import Header from 'components/Header';
import Loading from 'components/Loading';

import styles from './routedView.css';

export default class RoutedView extends Component {
  constructor(props) {
    super(props);

    this.lazyLoadedRoutes = {};
  }

  loader() {
    const {load, path, delay=200} = this.props;
    const timeout = delay === 0 ? null :
      setTimeout(_ => {
        this.setState({
          pastDelay: true
        });
      }, delay);

    load && load(file => {
      timeout && clearTimeout(timeout);
      this.setState({
        child: file.default
      }, _ => {
        this.lazyLoadedRoutes[path] = file.default;
      });
    });
  }
  
  componentWillMount() {
    this.loader();
  }

  componentWillReceiveProps({path}) {
    if (this.props.path !== path) {
      let nextChild = this.lazyLoadedRoutes[path];

      this.setState({
        child: nextChild
      }, _ => {
        nextChild === undefined && this.loader();
      });
    }
  }

  render(props, {child, pastDelay}) {
    const usableChild = props.child || child || null;
    return (
      <div id="mount" class={styles.viewHasHeader}>
        <Header {...props} />
        <div class={styles.mainView}>
          {usableChild ? h(usableChild, props) : (pastDelay || props.delay === 0 ? <Loading /> : null)}
        </div>
      </div>
    );
  }
}