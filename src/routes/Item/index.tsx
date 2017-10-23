import {h, Component} from 'preact';
import WithData from 'components/WithData';
import Details from 'components/Details';
import getDetails from 'api/details';

interface Props {
  matches: any;
}
export default class extends Component<Props, null> {
  render({matches}) {
    return <WithData source={getDetails} values={{root: matches.id}} render={this.ItemViewWithData} />;
  }

  private ItemViewWithData = (data, error) => {
    return <Details data={data} matches={this.props.matches} error={error} />;
  };
}
