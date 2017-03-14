import {h, Component} from 'preact';
import withListType from './withListType.hoc.js';

export default class ListHome extends Component {
  render({listType}) {
    const ListHomeWithListType = withListType(listType);

    return <ListHomeWithListType />;
  }
}