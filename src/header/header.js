import {h, Component} from 'preact';
import {Link} from 'preact-router';
import objstr from 'obj-str';

import Logo from '../icons/logo.js';

import styles from './header.css';

function Item({href, text, url}) {
  const hrefRegex = href === '/' ? /(\/$|\/top)/ : new RegExp(href);

  return (
    <li class={styles.item}>
      <Link href={href} class={objstr({
        [styles.link]: true,
        [styles.active]: hrefRegex.test(url)
      })}>{text}</Link>
    </li>
  );
};

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      online: true
    };

    this.handleNetworkChange = this.handleNetworkChange.bind(this);
  }

  shouldComponentUpdate({listType}, {online}) {
    return listType !== this.props.listType || online !== this.state.online;
  }

  handleNetworkChange() {
    this.setState({
      online: navigator.onLine
    });
  }
  componentDidMount() {
    window.addEventListener('online', this.handleNetworkChange);
    window.addEventListener('offline', this.handleNetworkChange);
  }
  componentWillUnmount() {
    window.removeEventListener('online', this.handleNetworkChange);
    window.removeEventListener('offline', this.handleNetworkChange);
  }

  render({url}, {online}) {
    return (
      <nav class={objstr({
        [styles.header]: true,
        [styles.offline]: !online
      })}>
        <ol class={styles.links}>
          <li class={styles.logo}>
            <Link href='/' aria-label="Home" url={url}>
              <Logo />
            </Link>
          </li>
          <Item href='/' text='top' url={url}/>
          <Item href='/new/1' text='new' url={url}/>
          <Item href='/show/1' text='show' url={url}/>
          <Item href='/ask/1' text='ask' url={url}/>
          <Item href='/jobs/1' text='jobs' url={url}/>
          <Item href='/about' text='about' url={url}/>
        </ol>
      </nav>
    );
  }
}