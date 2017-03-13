import {h, Component} from 'preact';
import withData from '../../core/withData.hoc.js';

import {GetItems} from '../../core/api/items.js';
import LoadingView from '../../core/loadingView.js';

import styles from './item.css';

class ItemView extends Component {
  render({matches: {id}, data}) {
    if (!data || data === null) {
      return <LoadingView />;
    }

    const thisItem = data[parseInt(id, 10)];
    const hostname = new URL(thisItem.url).hostname;
    return (
      <div class={styles.wrapper}>
        <article class={styles.article}>
          <h1><a href={thisItem.url} class={styles.outboundLink}>{thisItem.title}</a></h1>
          <small class={styles.hostname}>({new URL(thisItem.url).hostname})</small>
          <p>{thisItem.score} points by <a href={`/user/${thisItem.by}`} class={styles.link}>{thisItem.by}</a></p>
        </article>
        <div class={styles.comments}>
          <h2>{thisItem.descendants} comments</h2>
          <LoadingView />
        </div>
      </div>
    );
  }  
}

export default class ItemHome extends Component {
  render(props) {
    const id = props.matches.id;
    const ItemViewWithData = withData(ItemView, {fetchDataFunction: GetItems, properties: {keys: [id]}});

    return <ItemViewWithData {...props} />
  }
}