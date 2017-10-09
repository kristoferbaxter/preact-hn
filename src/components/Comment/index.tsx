import {h, Component} from 'preact';
//import Markup from 'preact-markup';
//TODO: Investigate switching over to Markup. <div><Markup markup={text} /></div>

import WithData from 'components/WithData';
import Loading from 'components/Loading';
import Text from 'components/Text';

import formatTime from 'utils/time';
import comments from 'api/comments';

import styles from './styles.css';

const Error = _ => navigator.onLine && <Text text={'Unable to load comments.'} />;

interface CommentProps {
  root: number;
  data: any;
  kidsOnly?: boolean;
}
function Comment({root, data, kidsOnly}: CommentProps): JSX.Element {
  if (!data || data === null) {
    return <Loading />;
  }

  if (kidsOnly) {
    const {kids} = data[root];
    return kids && <div>{Object.values(kids).map(kid => <Comment root={kid} data={data} />)}</div>;
  }

  const {by, time, text, kids} = data[root];
  return (
    text && (
      <article class={styles.comment}>
        <header class={styles.header}>
          <a href={`/user/${by}`} class={styles.userLink}>
            {by}
          </a>
          <span class={styles.ago}>{formatTime(time)} ago</span>
        </header>
        <Text text={text} isComment={true} />
        {kids && (
          <div class={styles.kids}>
            {Object.values(kids).map(kid => <Comment root={kid} data={data} kidsOnly={false} />)}
          </div>
        )}
      </article>
    )
  );
}

interface Props {
  descendants: number;
  root: number;
}
export default class Export extends Component<Props, null> {
  render({root}) {
    return <WithData source={comments} values={{root}} render={this.CommentsWithData} />;
  }

  private CommentsWithData = (data, error): JSX.Element => {
    const {descendants} = this.props;
    return (
      <div class={styles.comments}>
        {!error && <h2 class={styles.numberOfComments}>{`${descendants} comment${descendants > 1 && 's'}`}</h2>}
        {error && <Error />}
        {!error && (
          <section>
            <Comment root={this.props.root} data={data} kidsOnly={true} />
          </section>
        )}
      </div>
    );
  };
}
