import {h} from 'preact';

import styles from './styles.css';

export default (): JSX.Element => {
  return (
    <article class={styles.about}>
      <h1 class={styles.header}>Simple Hacker News Clone</h1>
      <p>This is an example of a PWA built using Preact, Webpack, and some opinionated tools.</p>
      <p>
        <strong>Please do not build an application this way</strong>. Instead view this as an example of some concepts
        used in modern web applications (sw, h2, h2push).
      </p>
      <p>Made with kindness in California.</p>
    </article>
  );
};
