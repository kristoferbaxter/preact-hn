import {h} from 'preact';
import objstr from 'obj-str';

import styles from './text.css';

export default ({text, isComment=false}) => {
  return (text !== undefined || text !== null) && (
    <div class={objstr({
      [styles.text]: true,
      [styles.comment]: isComment
    })} dangerouslySetInnerHTML={{__html: text}} />
  );
}