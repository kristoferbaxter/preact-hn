import {h} from 'preact';
import {Router} from 'preact-router';
import RoutedView from './core/routedView.js';
import LoadingView from './core/loadingView.js';
import {LIST_TYPES} from './lists/constants.js';

const ROUTE_BUNDLE = {
  list: require('bundle-loader?lazy&name=ListHome!./lists/views/list.js'),
  about: require('bundle-loader?lazy&name=AboutHome!./about/views/about.js'),
  item: require('bundle-loader?lazy&name=ItemHome!./item/views/item.js'),
  user: require('bundle-loader?lazy&name=UserHome!./lists/views/user.js')
};

export default function(props) {
  return (
    <Router>
      <RoutedView
        path='/new'  
        load={ROUTE_BUNDLE.list}
        listType={LIST_TYPES.new}
        {...props}>
        <LoadingView />
      </RoutedView>
      <RoutedView
        path='/new/:page'  
        load={ROUTE_BUNDLE.list}
        listType={LIST_TYPES.new}
        {...props}>
        <LoadingView />
      </RoutedView>
      <RoutedView
        path='/show'  
        load={ROUTE_BUNDLE.list}
        listType={LIST_TYPES.show}
        {...props}>
        <LoadingView />
      </RoutedView>
      <RoutedView
        path='/show/:page'  
        load={ROUTE_BUNDLE.list}
        listType={LIST_TYPES.show}
        {...props}>
        <LoadingView />
      </RoutedView>
      <RoutedView
        path='/ask'  
        load={ROUTE_BUNDLE.list}
        listType={LIST_TYPES.ask}
        {...props}>
        <LoadingView />
      </RoutedView>
      <RoutedView
        path='/ask/:page'  
        load={ROUTE_BUNDLE.list}
        listType={LIST_TYPES.ask}
        {...props}>
        <LoadingView />
      </RoutedView>
      <RoutedView
        path='/jobs'  
        load={ROUTE_BUNDLE.list}
        listType={LIST_TYPES.jobs}
        {...props}>
        <LoadingView />
      </RoutedView>
      <RoutedView
        path='/jobs/:page'  
        load={ROUTE_BUNDLE.list}
        listType={LIST_TYPES.jobs}
        {...props}>
        <LoadingView />
      </RoutedView>
      <RoutedView
        path='/about'  
        load={ROUTE_BUNDLE.about}
        {...props}>
        <LoadingView />
      </RoutedView>
      <RoutedView
        path='/item/:id'  
        load={ROUTE_BUNDLE.item}
        name='ItemHome'
        {...props}>
        <LoadingView />
      </RoutedView>
      <RoutedView
        path='/user/:id'  
        load={ROUTE_BUNDLE.user}
        {...props}>
        <LoadingView />
      </RoutedView>
      <RoutedView
        path="/top/:page" default
        load={ROUTE_BUNDLE.list}
        listType={LIST_TYPES.top}
        {...props}>
      <LoadingView />
      </RoutedView>
    </Router>
  );
}