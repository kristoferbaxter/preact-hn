import {h, Component} from 'preact';
import {LIST_TYPES} from '../../core/api/list.js';
import withListType from '../withListType.hoc.js';

export default class NewHome extends Component {
  render() {
    const HomeWithListType = withListType(LIST_TYPES.new);

    return <HomeWithListType />;
  }
}