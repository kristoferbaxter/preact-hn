import {h, Component} from 'preact';
import WithData from 'components/WithData';
import Details from 'components/Details';
import getItems from 'api/items';

interface Props {
  matches: any;
}
export default class extends Component<Props, null> {
  render({matches}) {
    return <WithData source={getItems} values={{keys: [matches.id]}} render={this.ItemViewWithData} />;
  }

  private ItemViewWithData(data) {
    return <Details data={data} matches={this.props.matches} />;
  };
}
