import {h} from 'preact';
import {Router} from 'preact-router';
import RoutedView from './core/routedView';
import ListView from 'components/ListView';
import {LIST_TYPES} from 'src/utilities/constants';

export default props => (
  <Router>
    <RoutedView path='/top/:page' default listType={LIST_TYPES.top} child={ListView} delay={0} />
    <RoutedView path='/new/:page' listType={LIST_TYPES.new} child={ListView} delay={0}  />
    <RoutedView path='/show/:page' listType={LIST_TYPES.show} child={ListView} delay={0}  />
    <RoutedView path='/ask/:page' listType={LIST_TYPES.ask} child={ListView} delay={0} />
    <RoutedView path='/jobs/:page' listType={LIST_TYPES.jobs} child={ListView} delay={0} />
    <RoutedView path='/about' load={require('bundle-loader?lazy&name=AboutHome!./about/views/about')} {...props} />
    <RoutedView path='/item/:id' load={require('bundle-loader?lazy&name=ItemHome!./components/Details')} {...props} />
    <RoutedView path='/user/:id' load={require('bundle-loader?lazy&name=UserHome!./lists/views/user.js')} {...props} />
  </Router>
);