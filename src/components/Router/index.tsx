import {cloneElement, Component} from 'preact';
import {exec, pathRankSort} from './utils';

const enum HistoryChange {
  push = 'pushState',
  replace = 'replaceState',
}

const isPreactElement = (node): boolean => node.__preactattr_ != null;
const currentUrl = (): string => `${location.pathname}${location.search}`;
const prevent = (event: MouseEvent): void => {
  event.stopImmediatePropagation();
  event.stopPropagation();
  event.preventDefault();
};

function routeFromLink(node: HTMLElement, method: (url) => void): void {
  // only valid elements
  if (!node || !node.getAttribute) return;

  const href = node.getAttribute('href');
  if (!href || !href.match(/^\//g)) return;

  // attempt to route.
  return method(href);
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
      url: props.url || currentUrl(),
    };
  }

  shouldComponentUpdate(props, state) {
    return props.url !== this.props.url || state.url !== this.state.url;
  }
  componentDidMount() {
    addEventListener('popstate', this.popStateHandler);
    addEventListener('click', this.handleLinkClick);
  }
  componentWillUnmount() {
    removeEventListener('popstate', this.popStateHandler);
    removeEventListener('click', this.handleLinkClick);
  }

  public routeTo = (url: string, modifyHistory: boolean = true): boolean => {
    if (modifyHistory && history) {
      history[HistoryChange.push](null, null, url);
    }
    this.setState({
      url,
    });

    return true;
  };

  render({children}: Props, {url}: State): JSX.Element {
    const active = this.getMatchingChildren(children, url, true);

    return active[0] || null;
  }

  private popStateHandler = (): boolean => this.routeTo(currentUrl(), false);

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
