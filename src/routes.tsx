import {h} from 'preact';
import {Router} from 'preact-router';
import RoutedView from './core/routedView';
import List from 'routes/List';
import {LIST_TYPES} from 'utils/constants';

export default props => (
  <Router>
    <RoutedView path="/top/:page" default listType={LIST_TYPES.top} child={List} delay={0} />
    <RoutedView path="/new/:page" listType={LIST_TYPES.new} child={List} delay={0} />
    <RoutedView path="/show/:page" listType={LIST_TYPES.show} child={List} delay={0} />
    <RoutedView path="/ask/:page" listType={LIST_TYPES.ask} child={List} delay={0} />
    <RoutedView path="/jobs/:page" listType={LIST_TYPES.jobs} child={List} delay={0} />
    <RoutedView path="/about" load={require('bundle-loader?lazy&name=AboutHome!./routes/About')} {...props} />
    <RoutedView path="/item/:id" load={require('bundle-loader?lazy&name=ItemHome!./routes/Item')} {...props} />
    <RoutedView path="/user/:id" load={require('bundle-loader?lazy&name=UserHome!./routes/User')} {...props} />
  </Router>
);
