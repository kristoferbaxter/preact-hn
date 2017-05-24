import {h} from 'preact';
//import Markup from 'preact-markup';
//TODO: Investigate switching over to Markup. <div><Markup markup={text} /></div> 

import timeFormat from '../../core/time.js';
import GetComments from '../../core/api/comments.js';
import withData from '../../core/withData.hoc.js';
import LoadingView from '../../core/loadingView.js';
import Text from './text.js';

import styles from './comments.css';

function Comment({root, data, kidsOnly}) {
  if (!data || data === null) {
    return <LoadingView />;
  }

  if (kidsOnly) {
    const {kids} = data[root];
    return kids && <div>{Object.values(kids).map((kid) => <Comment root={kid} data={data} />)}</div>;
  }

  const {by, time, text, kids} = data[root];
  return text ? (
    <article class={styles.comment}>
      <header class={styles.header}>
        <a href={`/user/${by}`} class={styles.userLink}>{by}</a>
        <span class={styles.ago}>{timeFormat(time)} ago</span>
      </header>
      <Text text={text} isComment={true} />
      {kids && <div class={styles.kids}>{Object.values(kids).map((kid) => <Comment root={kid} data={data} kidsOnly={false} />)}</div>}
    </article>
  ) : null;
}

export default ({root}) => {
  const CommentWithData = withData(Comment, {fetchDataFunction: GetComments, properties: {root: root}});

  return (
    <section>
      <CommentWithData root={root} kidsOnly={true} />  
    </section>
  );
}