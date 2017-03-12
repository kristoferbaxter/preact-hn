import {h, Component} from 'preact';
import withData from '../core/withDataHOC.js';

import {GetNewApi} from '../core/api/new.js';
import LoadingView from '../core/loadingView.js';
import ListItem from '../lists/item.js';

class NewView extends Component {
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

export default class NewHome extends Component {
  render() {
    const NewViewWithData = withData(NewView, {fetchDataFunction: GetNewApi, properties: {from: 0, to: 20}});

    return <NewViewWithData />
  }
}