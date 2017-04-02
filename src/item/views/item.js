import {h, Component} from 'preact';
import withData from '../../core/withData.hoc.js';
import {GetItems} from '../../core/api/items.js';
import LoadingView from '../../core/loadingView.js';
import Comments from './comments.js';
import Text from './text';

import styles from './item.css';

class ItemView extends Component {
  render({matches: {id}, data}) {
    if (!data || data === null) {
      return <LoadingView />;
    }

    const thisId = parseInt(id, 10);
    const {url, title, score, by, descendants, text} = data[thisId];
    return (
      <div class={styles.wrapper}>
        <article class={styles.article}>
          <h1><a href={url} class={styles.outboundLink}>{title}</a></h1>
          {url && <small class={styles.hostname}>({new URL(url).hostname})</small>}
          <p class={styles.byline}>{score} points by <a href={`/user/${by}`} class={styles.link}>{by}</a></p>
          <Text text={text} />
        </article>
        <div class={styles.comments}>
          <h2 class={styles.numberOfComments}>{descendants} comments</h2>
          <Comments root={thisId} />
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