'use strict';

const {getItem} = require('../../storage/foreground.js');

/*
 * storage {Object}
 *   - entityIds {Array}
 *   - comments {Object}
 * 
 * return {
 *  entityIds: [],
 *  comments: {}
 * }
 */

/*
 *
 * return {
 *  $entities: {},
 *  comments: {}
 * }
 * 
 * with kids
 *  - res.$entities.push(data)
 *  - comments: {
 *      [data.id]: {
 *         ...kids
 *      }
 *    }
 * 
 * deepest
 *  - res.$entities.push(data)
 *  - comments: {
 *      $sentinel: true
 *    }
 */

function getComments(res, acc, id, log) {
  const item = getItem(id, log);

  res.$entities[id] = item;
  if (item.kids && item.kids.length > 0) {
    acc.id = item.id;
    item.kids.forEach((kid, index) => {
      let kidComments = {};
      acc[index] = getComments(res, kidComments, kid, log);
    });
  } else {
    acc = {
      id: item.id,
      $sentinel: true
    };
  }

  return acc;
}

function apiCommentsRoute(req, res, next) {
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.$entities = {};

  const root = req.params.id;
  const comments = getComments(res, {}, root, req.log);
  
  res.send({
    $entities: res.$entities,
    comments: comments
  });

  next();
}

module.exports = {
  route: apiCommentsRoute
};