const EMPTY = {};

interface Options {
  default?: boolean;
}
export function exec(url: string, route: string = '', opts: Options = EMPTY): object | false {
  const reg = /(?:\?([^#]*))?(#.*)?$/;
  const c = url.match(reg);

  let matches = {};
  let ret;

  if (c && c[1]) {
    let p = c[1].split('&');
    for (let i = 0; i < p.length; i++) {
      let r = p[i].split('=');
      matches[decodeURIComponent(r[0])] = decodeURIComponent(r.slice(1).join('='));
    }
  }

  const urlSegments = segmentize(url.replace(reg, ''));
  const routeSegments = segmentize(route);
  let max = Math.max(urlSegments.length, routeSegments.length);

  for (let i = 0; i < max; i++) {
    if (routeSegments[i] && routeSegments[i].charAt(0) === ':') {
      const param = routeSegments[i].replace(/(^\:|[+*?]+$)/g, '');
      const flags = (routeSegments[i].match(/[+*?]+$/) || EMPTY)[0] || '';
      const plus = ~flags.indexOf('+');
      const star = ~flags.indexOf('*');
      const val = urlSegments[i] || '';

      if (!val && !star && (flags.indexOf('?') < 0 || plus)) {
        ret = false;
        break;
      }

      matches[param] = decodeURIComponent(val);
      if (plus || star) {
        matches[param] = urlSegments
          .slice(i)
          .map(decodeURIComponent)
          .join('/');
        break;
      }
    } else if (routeSegments[i] !== urlSegments[i]) {
      ret = false;
      break;
    }
  }
  if (opts.default !== true && ret === false) return false;
  return matches;
}

export function pathRankSort(a, b): number {
  const {attributes: aAttr} = a;
  const {attributes: bAttr} = b;
  if (aAttr.default) return 1;
  if (bAttr.default) return -1;
  let diff = rank(aAttr.path) - rank(bAttr.path);
  return diff || aAttr.path.length - bAttr.path.length;
}

export function segmentize(url: string): string[] {
  return strip(url).split('/');
}
export function rank(url: string): number {
  return (strip(url).match(/\/+/g) || '').length;
}
export function strip(url: string): string {
  return url.replace(/(^\/+|\/+$)/g, '');
}
