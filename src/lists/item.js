import {h} from 'preact';

import styles from './item.css';

const nearest = (count, units) => {
  return count = ~~count, 1 !== count && (units += "s"), count + " " + units;
};
const timeFormat = ({time}) => {
  const delta = Date.now()/1000 - time;

  if (delta < 3600) {
    return nearest(delta/60, "minute");
  }
  if (delta < 86400) {
    return nearest(delta/3600, "hour");
  }
  return nearest(delta/86400, "day"); 
}

const Comments = ({entity: {descendants, id}}) => {
  const commentText = descendants > 1 ? `${descendants} comments` : 'discuss';

  return <span> | <a href={`/item/${id}`} class={styles.link}>{commentText}</a></span>;
}

export default function ListItem({index, entity}) {
  const {url, title, score, by} = entity;
  return (
    <article class={styles.article}>
      <span class={styles.index}>{index}</span>
      <div class={styles.metadata}>
        <h2><a href={url} class={styles.outboundLink}>{title}</a></h2>
        <p>{score} points by <a href={`/user/${by}`} class={styles.link}>{by}</a> {timeFormat(entity)} ago<Comments entity={entity} /></p>
      </div>
    </article>
  );
}

