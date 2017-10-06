import {h} from 'preact';
import Logo from 'components/Logo';

import styles from './styles.css';

export default (): JSX.Element => (
  <div class={styles.routeLoading}>
    <Logo width={60} height={60} />
  </div>
);
