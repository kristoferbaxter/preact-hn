import {h, Component} from 'preact';
import withData from '../core/withDataHOC.js';

import {GetTopApi} from '../core/api/top.js';
import LoadingView from '../core/loadingView.js';
import ListItem from '../lists/item.js';

class TopView extends Component {
  render({data: {items, entities}}) {
    if (!items || items === null) {
      return <LoadingView />;
    }

    return (
      <main>
        {Object.keys(items).map(item => {
          const itemAsInt = parseInt(item, 10);
          return <ListItem index={itemAsInt+1} entity={entities[items[itemAsInt]]} />;
        })}
      </main>
    );
  }  
}

export default class TopHome extends Component {
  render() {
    const TopViewWithData = withData(TopView, {fetchDataFunction: GetTopApi, properties: {from: 0, to: 20}});

    return <TopViewWithData />
  }
}