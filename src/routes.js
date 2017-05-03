import {h} from 'preact';
import {Router} from 'preact-router';
import RoutedView from './core/routedView.js';
import LoadingView from './core/loadingView.js';
import {LIST_TYPES} from './lists/constants.js';

import ListView from './lists/views/list.js';

import styles from './routes.css';

const ROUTE_BUNDLE_ABOUT = require('bundle-loader?lazy&name=AboutHome!./about/views/about.js');
const ROUTE_BUNDLE_ITEM = require('bundle-loader?lazy&name=ItemHome!./item/views/item.js');
const ROUTE_BUNDLE_USER = require('bundle-loader?lazy&name=UserHome!./lists/views/user.js');

export default function(props) {
  return (
    <div class={styles.viewHasHeader}>
      <Router>
        <RoutedView path='/new' listType={LIST_TYPES.new} child={ListView} delay={0}/>
        <RoutedView path='/new' listType={LIST_TYPES.new} child={ListView} delay={0}/>
        <RoutedView path='/new/:page' listType={LIST_TYPES.new} child={ListView} delay={0}/>
        <RoutedView path='/show' listType={LIST_TYPES.show} child={ListView} delay={0}/>
        <RoutedView path='/show/:page' listType={LIST_TYPES.show} child={ListView} delay={0}/>
        <RoutedView path='/ask' listType={LIST_TYPES.ask} child={ListView} delay={0}/>
        <RoutedView path='/ask/:page' listType={LIST_TYPES.ask} child={ListView} delay={0}/>
        <RoutedView path='/jobs' listType={LIST_TYPES.jobs} child={ListView} delay={0}/>
        <RoutedView path='/jobs/:page' listType={LIST_TYPES.jobs} child={ListView} delay={0}/>
        <RoutedView path='/about' load={ROUTE_BUNDLE_ABOUT} {...props}>
          <LoadingView />
        </RoutedView>
        <RoutedView path='/item/:id' load={ROUTE_BUNDLE_ITEM} {...props}>
          <LoadingView />
        </RoutedView>
        <RoutedView path='/user/:id' load={ROUTE_BUNDLE_USER} {...props}>
          <LoadingView />
        </RoutedView>
        <RoutedView path='/top/:page' default listType={LIST_TYPES.top} child={ListView} delay={0}/>
      </Router>
    </div>
  );
}