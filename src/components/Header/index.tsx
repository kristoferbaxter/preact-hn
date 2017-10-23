import {h, Component} from 'preact';
import objstr from 'obj-str';

import Logo from 'components/Logo';

import styles from './styles.css';

interface ItemProps {
  href: string;
  text: string;
  url: string;
}
function Item({href, text, url}: ItemProps): JSX.Element {
  const hrefRegex = href === '/' ? /(\/$|\/top)/ : new RegExp(href);

  return (
    <li class={styles.item}>
      <a
        href={href}
        class={objstr({
          [styles.link]: true,
          [styles.active]: hrefRegex.test(url),
        })}
      >
        {text}
      </a>
    </li>
  );
}

interface Props {
  type: string;
  url: string;
}
interface State {
  online: boolean;
}
export default class extends Component<Props, State> {
  constructor(props) {
    super(props);

    if (IS_CLIENT) {
      this.state = {
        online: navigator.onLine,
      };
    }
    if (!IS_CLIENT) {
      this.state = {
        online: true,
      };
    }
  }

  shouldComponentUpdate({type}, {online}): boolean {
    return type !== this.props.type || online !== this.state.online;
  }

  componentDidMount(): void {
    addEventListener('online', this.handleNetworkChange);
    addEventListener('offline', this.handleNetworkChange);
  }
  componentWillUnmount(): void {
    removeEventListener('online', this.handleNetworkChange);
    removeEventListener('offline', this.handleNetworkChange);
  }

  render({url}: Props, {online}: State): JSX.Element {
    return (
      <nav
        class={objstr({
          [styles.header]: true,
          [styles.offline]: !online,
        })}
      >
        <ol class={styles.links}>
          <li class={styles.logo}>
            <a href="/" aria-label="Home">
              <Logo />
            </a>
          </li>
          <Item href="/" text="top" url={url} />
          <Item href="/new/1" text="new" url={url} />
          <Item href="/show/1" text="show" url={url} />
          <Item href="/ask/1" text="ask" url={url} />
          <Item href="/jobs/1" text="jobs" url={url} />
          <Item href="/about" text="about" url={url} />
        </ol>
      </nav>
    );
  }

  private handleNetworkChange = (): void => {
    this.setState({
      online: navigator.onLine,
    });
  };
}
