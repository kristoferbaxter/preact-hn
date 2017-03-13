import {h, Component} from 'preact';
import {LIST_TYPES} from '../../core/api/list.js';
import withListType from '../withListType.hoc.js';

export default class JobsHome extends Component {
  render() {
    const HomeWithListType = withListType(LIST_TYPES.jobs);

    return <HomeWithListType />;
  }
}