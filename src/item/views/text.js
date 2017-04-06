import {h} from 'preact';
import classnames from 'classnames';

import styles from './text.css';

export default function Text({text, isComment=false}) {
  if (text === undefined || text === null) return null;

  return <div class={classnames(styles.text, isComment && styles.comment)} dangerouslySetInnerHTML={{__html: text}} />;
}