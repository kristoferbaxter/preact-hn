import {h, Component} from 'preact';
//import Markup from 'preact-markup';
//TODO: Investigate switching over to Markup. <div><Markup markup={text} /></div> 

import timeFormat from '../../core/time.js';
import GetComments from '../../core/api/comments.js';
import WithData from '../../core/withData.js';
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
  return text && (
    <article class={styles.comment}>
      <header class={styles.header}>
        <a href={`/user/${by}`} class={styles.userLink}>{by}</a>
        <span class={styles.ago}>{timeFormat(time)} ago</span>
      </header>
      <Text text={text} isComment={true} />
      {kids && <div class={styles.kids}>{Object.values(kids).map((kid) => <Comment root={kid} data={data} kidsOnly={false} />)}</div>}
    </article>
  );
}


export default class extends Component {
  CommentWithData = data => <Comment root={this.props.root} data={data} kidsOnly={true} />;
  
  render = ({root}) => (
    <section>
      <WithData source={GetComments} values={{root}} render={this.CommentWithData} /> 
    </section>
  );
}