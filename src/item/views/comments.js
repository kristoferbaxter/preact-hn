import {h, Component} from 'preact';
//import Markup from 'preact-markup';
//TODO: Investigate switching over to Markup. <div><Markup markup={text} /></div> 

import timeFormat from '../../core/time.js';
import {GetComments} from '../../core/api/comments.js';
import withData from '../../core/withData.hoc.js';
import LoadingView from '../../core/loadingView.js';

import styles from './comments.css';

class Comment extends Component {
  render({root, data}) {
    console.log('render comments', data);
    if (!data || data === null) {
      return <LoadingView />;
    }

    const {by, time, text, kids} = data[root];
    return (
      <article class={styles.comment}>
        <header class={styles.header}>
          <a href={`/user/${by}`}>{by}</a>
          <span>{timeFormat(time)} ago</span>
        </header>
        {text && <div class={styles.text} dangerouslySetInnerHTML={{__html: text}} />}
        {kids && <div class={styles.kids}>{Object.values(kids).map((kid) => <Comment root={kid} data={data} />)}</div>}
      </article>
    );
  }
}

export default class Comments extends Component {
  render({root}) {
    const CommentWithData = withData(Comment, {fetchDataFunction: GetComments, properties: {root: root}});

    return (
      <section>
        <CommentWithData root={root} />  
      </section>
    );
  }
}