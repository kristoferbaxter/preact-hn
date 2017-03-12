import {h, Component} from 'preact';
import LoadingView from '../core/loadingView.js';
import ListItem from '../lists/item.js';

export default class ListView extends Component {
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