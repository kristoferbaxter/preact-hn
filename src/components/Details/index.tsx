import {h} from 'preact';
import {FeedItem, Details} from '@kristoferbaxter/hn-api';

import Loading from 'components/Loading';
import Comment from 'components/Comment';
import Text from 'components/Text';

import styles from './styles.css';

interface Props {
  data: FeedItem | Details;
  error: boolean;
  matches?: any;
  children?: JSX.Element[];
}
export default function({data, ...props}: Props): JSX.Element {
  if (!data || data === null) {
    return <Loading />;
  }

  return (
    <div>
      <article class={styles.article}>
        <h1>
          <a href={data.url} class={styles.outboundLink}>
            {data.title}
          </a>
        </h1>
        {data.domain && <small class={styles.hostname}>({data.domain})</small>}
        <p class={styles.byline}>
          {data.points} points by{' '}
          <a href={`/user/${data.user}`} class={styles.link}>
            {data.user}
          </a>
        </p>
        {(data as Details).content && <Text text={(data as Details).content} />}
      </article>
      <Comment
        descendants={data.comments_count}
        data={(data as Details).comments && (data as Details)}
        error={props.error}
      />
    </div>
  );
}
