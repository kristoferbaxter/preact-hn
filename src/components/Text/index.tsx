import {h} from 'preact';
import objstr from 'obj-str';

import styles from './styles.css';

interface Props {
  text: string;
  isComment?: boolean;
}
export default ({text, isComment = false}: Props): JSX.Element => {
  return (
    (text !== undefined || text !== null) && (
      <div
        class={objstr({
          [styles.text]: true,
          [styles.comment]: isComment,
        })}
        dangerouslySetInnerHTML={{__html: text}}
      />
    )
  );
};
