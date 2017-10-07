import {listRange} from 'api/list';
import {PagedList, List, ListRange} from 'api/api-types';
import {getItem, uuid as ForegroundDataUUID, latest} from '../../storage/foreground';

function generateJSON(req, {type, from, to, uuid}): List & ListRange {
  const latestNewItems = latest(type);
  const rangedItems = latestNewItems.slice(from,to);

  return {
    uuid,
    type,
    from,
    to,
    max: latestNewItems.length,
    items: rangedItems.reduce(function(acc, cur, index) {
      acc[index+from] = cur;
      return acc;
    }, {}),
    $entities: rangedItems.reduce(function(acc, cur, index) {
      const item = getItem(cur);
      if (item) {
        acc[item.id] = item;
      }
      return acc;
    }, {})
  }
}

export function route(req, res, next): void {
  res.setHeader('content-type', 'application/json; charset=utf-8');

  const {type, from=0, to=29, uuid} = req.query;
  res.send(generateJSON(req, {
    type,
    from: Number(from),
    to: Number(to),
    uuid: uuid || ForegroundDataUUID(type),
  }));

  next();
}

export function serverRoute(req, {type}): PagedList {
  const page = req.params.id || 1;
  const {from, to} = listRange(page);
  let json = generateJSON(req, {type, from, to, uuid: ForegroundDataUUID(type)});

  return Object.assign(json, {page});
}