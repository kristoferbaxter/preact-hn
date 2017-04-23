import {h, Component} from 'preact';
import {Link} from 'preact-router';
import objstr from 'obj-str';

import Logo from '../icons/logo.js';

import styles from './header.css';

const Item = ({href, text}, {url}) => {
  const hrefRegex = href === '/' ? /(\/$|\/top)/ : new RegExp(href);

  return (
    <li class={styles.item}>
      <Link href={href} class={objstr({
        [styles.link]: true,
        [styles.active]: hrefRegex.test(url)
      })}>{text}</Link>
    </li>
  );
};

export default class extends Component {
  render(props, state, {url}) {
    return (
      <nav class={styles.header}>
        <ol class={styles.links}>
          <li class={styles.logo}>
            <Link href='/'>
              <Logo />
            </Link>
          </li>
          <Item href='/' text='top'/>
          <Item href='/new' text='new'/>
          <Item href='/show' text='show'/>
          <Item href='/ask' text='ask'/>
          <Item href='/jobs' text='jobs'/>
          <Item href='/about' text='about'/>
        </ol>
      </nav>
    );
  }
}