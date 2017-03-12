import {h, Component} from 'preact';
import {GetTopApi} from '../core/api/top.js';
import withData from '../core/withDataHOC.js';
import ListView from './list.js';

export default class TopHome extends Component {
  render() {
    const ViewWithData = withData(ListView, {fetchDataFunction: GetTopApi, properties: {from: 0, to: 20}});

    return <ViewWithData />
  }
}