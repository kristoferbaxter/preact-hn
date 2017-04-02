import {h} from 'preact';

import styles from './text.css';

export default function Text({text, isComment=false}) {
  if (text === undefined || text === null) return null;

  return <div class={{
    [styles.text]: true,
    [styles.comment]: isComment
  }} dangerouslySetInnerHTML={{__html: text}} />;
}