import {getItem} from '../../storage/foreground';

export function route(req, res, next) {
  res.setHeader('content-type', 'application/json; charset=utf-8');

  const ItemsToRetrieve = JSON.parse(req.query.items);

  res.send({
    '$entities': ItemsToRetrieve.reduce(function(acc, cur, index) {
      const item = getItem(cur);
      acc[item.id] = item;
      return acc;
    }, {})
  });

  next();
}