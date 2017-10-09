import {h} from 'preact';

import Loading from 'components/Loading';
import Comment from 'components/Comment';
import Text from 'components/Text';

import styles from './styles.css';

interface Props {
  data: any;
  matches?: any;
  children?: JSX.Element[];
}
export default function({matches: {id}, data}: Props): JSX.Element {
  if (!data || data === null) {
    return <Loading />;
  }

  const thisId = parseInt(id, 10);
  const {url, title, score, by, descendants = 0, text} = data[thisId];
  return (
    <div>
      <article class={styles.article}>
        <h1>
          <a href={url} class={styles.outboundLink}>
            {title}
          </a>
        </h1>
        {url && <small class={styles.hostname}>({new URL(url).hostname})</small>}
        <p class={styles.byline}>
          {score} points by{' '}
          <a href={`/user/${by}`} class={styles.link}>
            {by}
          </a>
        </p>
        <Text text={text} />
      </article>
      <Comment descendants={descendants} root={thisId} />
    </div>
  );
}
