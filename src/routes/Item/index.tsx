import {h, Component} from 'preact';
import WithData from 'components/WithData';
import LoadingView from 'components/Loading';
import Comment from 'components/Comment';
import Text from 'components/Text';

import getItems from 'api/items';

import styles from './styles.css';

interface DetailsViewProps {
  data: any;
  matches?: any;
  children?: JSX.Element[];
}
function Details({matches: {id}, data}: DetailsViewProps): JSX.Element {
  if (!data || data === null) {
    return <LoadingView />;
  }

  const thisId = parseInt(id, 10);
  const {url, title, score, by, descendants=0, text} = data[thisId];
  return (
    <div>
      <article class={styles.article}>
        <h1><a href={url} class={styles.outboundLink}>{title}</a></h1>
        {url && <small class={styles.hostname}>({new URL(url).hostname})</small>}
        <p class={styles.byline}>{score} points by <a href={`/user/${by}`} class={styles.link}>{by}</a></p>
        <Text text={text} />
      </article>
      <Comment descendants={descendants} root={thisId} />
    </div>
  );
}

interface Props {
  matches: any;
}
export default class extends Component<Props, null> {
  render({matches}) {
    return <WithData source={getItems} values={{keys: [matches.id]}} render={this.ItemViewWithData} />;
  }

  private ItemViewWithData = (data) => {
    return <Details data={data} matches={this.props.matches} />;  
  }
}