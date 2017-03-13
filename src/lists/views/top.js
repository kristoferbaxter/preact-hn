import {h, Component} from 'preact';
import {LIST_TYPES} from '../../core/api/list.js';
import withListType from '../withListType.hoc.js';

export default class TopHome extends Component {
  render(props) {
    const HomeWithListType = withListType(LIST_TYPES.top);

    return <HomeWithListType {...props} />;
  }
}