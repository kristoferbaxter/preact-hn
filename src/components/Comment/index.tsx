import {h} from 'preact';
//import Markup from 'preact-markup';
//TODO: Investigate switching over to Markup. <div><Markup markup={text} /></div>

import Loading from 'components/Loading';
import Text from 'components/Text';

import formatTime from 'utils/time';
import {Details} from '@kristoferbaxter/hn-api';

import styles from './styles.css';

const Error = _ => navigator.onLine && <Text text={'Unable to load comments.'} />;

interface CommentProps {
  data: Details;
  kidsOnly?: boolean;
}
function Comment({data, kidsOnly}: CommentProps): JSX.Element {
  if (!data || data === null) {
    return <Loading />;
  }

  if (kidsOnly) {
    const {comments} = data;
    return comments && <div>{comments.map(comment => <Comment data={comment} />)}</div>;
  }

  const {user, time, content, comments} = data;
  return (
    content && (
      <article class={styles.comment}>
        <header class={styles.header}>
          <a href={`/user/${user}`} class={styles.userLink}>
            {user}
          </a>
          <span class={styles.ago}>{formatTime(time)}</span>
        </header>
        <Text text={content} isComment={true} />
        {comments && (
          <div class={styles.kids}>{comments.map(comment => <Comment data={comment} kidsOnly={false} />)}</div>
        )}
      </article>
    )
  );
}

interface Props {
  descendants: number;
  data: Details;
  error: boolean;
}
export default function({descendants, data, error}: Props): JSX.Element {
  return (
    <div class={styles.comments}>
      {!error && descendants > 0 ? <h2 class={styles.numberOfComments}>{descendants} comments</h2> : null}
      {error && <Error />}
      {!error && (
        <section>
          <Comment data={data} kidsOnly={true} />
        </section>
      )}
    </div>
  );
}
