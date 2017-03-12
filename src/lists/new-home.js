import {h, Component} from 'preact';
import {GetNewApi} from '../core/api/new.js';
import withData from '../core/withDataHOC.js';
import ListView from './list.js';

export default class NewHome extends Component {
  render() {
    const ViewWithData = withData(ListView, {fetchDataFunction: GetNewApi, properties: {from: 0, to: 20}});

    return <ViewWithData />
  }
}