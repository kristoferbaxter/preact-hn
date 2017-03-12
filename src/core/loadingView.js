import {h} from 'preact';
import Logo from '../icons/logo.js';
import styles from './routeLoading.css';

export default function LoadingView() {
  return <div class={styles.routeLoading}><Logo width={60} height={60} /></div>;
}