import {cloneElement, h, Component} from 'preact';
import {exec, pathRankSort} from './utils';

const isPreactElement = node => node.__preactattr_ != null;

const enum HistoryChange {
  push = 'pushState',
  replace = 'replaceState',
}
function setUrl(url: string, type: HistoryChange = HistoryChange.push): void {
  if (typeof history !== 'undefined' && history[type]) {
    history[type](null, null, url);
  }
}

function routeFromLink(node: HTMLElement, method: (url) => void): void {
  // only valid elements
  if (!node || !node.getAttribute) return;

  const href = node.getAttribute('href');
  if (!href || !href.match(/^\//g)) return;

  // attempt to route.
  return method(href);
}

function prevent(event: MouseEvent): boolean {
  if (event) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
  }
  return false;
}

interface Props {
  url?: string;
  children?: JSX.Element[];
}
interface State {
  url: string;
}
export default class Router extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      url: props.url || `${location.pathname}${location.search}`,
    };
  }

  shouldComponentUpdate(props, state) {
    return props.url !== this.props.url || state.url !== this.state.url;
  }
  componentDidMount() {
    addEventListener('click', this.handleLinkClick);
  }
  componentWillUnmount() {
    removeEventListener('click', this.handleLinkClick);
  }

  public routeTo = (url: string): boolean => {
    setUrl(url);
    this.setState({
      url,
    });

    return true;
  };

  render({children}: Props, {url}: State): JSX.Element {
    const active = this.getMatchingChildren(children, url, true);

    return active[0] || null;
  }

  private getMatchingChildren = (children: JSX.Element[], url: string, invoke: boolean): (JSX.Element | false)[] => {
    return children
      .slice()
      .sort(pathRankSort)
      .map(vnode => {
        const attrs = vnode.attributes || {};
        const {path} = attrs;
        const matches = exec(url, path, attrs);
        if (matches) {
          if (invoke === false) {
            return vnode;
          }
          const newProps = {url, matches};
          return cloneElement(vnode, Object.assign(newProps, matches));
        }
        return false;
      })
      .filter(vnode => vnode !== false);
  };
  // private canRoute = (url) => this.getMatchingChildren(this.props.children, url, false).length > 0;
  private handleLinkClick = (event: MouseEvent): void => {
    // ignore events the browser takes care of already:
    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || event.button !== 0) {
      return;
    }

    let {target} = event;
    do {
      if (
        String((target as HTMLElement).nodeName).toLowerCase() === 'a' &&
        (target as HTMLElement).getAttribute('href') &&
        isPreactElement(target as HTMLElement)
      ) {
        if ((target as HTMLElement).hasAttribute('native')) return;
        // if link is handled by the router, prevent browser defaults
        if (routeFromLink(target as HTMLElement, this.routeTo)) {
          prevent(event);
        }
      }
    } while ((target = (target as HTMLElement).parentNode));
  };
}

export function Link(props: object): JSX.Element {
  return h('a', Object.assign({onClick: handleLinkClick}, props));
}
