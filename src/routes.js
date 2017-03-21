import {h} from 'preact';
import {Router} from 'preact-router';
import RoutedView from './core/routedView.js';
import LoadingView from './core/loadingView.js';
import {LIST_TYPES} from './lists/constants.js';

export default function Routes(props) {
  return (
    <Router>
      <RoutedView
        path='/new'  
        load={require('bundle-loader?lazy&name=ListHome!./lists/views/list.js')}
        listType={LIST_TYPES.new}
        {...props}>
        <LoadingView />
      </RoutedView>
      <RoutedView
        path='/new/:page'  
        load={require('bundle-loader?lazy&name=ListHome!./lists/views/list.js')}
        listType={LIST_TYPES.new}
        {...props}>
        <LoadingView />
      </RoutedView>
      <RoutedView
        path='/show'  
        load={require('bundle-loader?lazy&name=ListHome!./lists/views/list.js')}
        listType={LIST_TYPES.show}
        {...props}>
        <LoadingView />
      </RoutedView>
      <RoutedView
        path='/show/:page'  
        load={require('bundle-loader?lazy&name=ListHome!./lists/views/list.js')}
        listType={LIST_TYPES.show}
        {...props}>
        <LoadingView />
      </RoutedView>
      <RoutedView
        path='/ask'  
        load={require('bundle-loader?lazy&name=ListHome!./lists/views/list.js')}
        listType={LIST_TYPES.ask}
        {...props}>
        <LoadingView />
      </RoutedView>
      <RoutedView
        path='/ask/:page'  
        load={require('bundle-loader?lazy&name=ListHome!./lists/views/list.js')}
        listType={LIST_TYPES.ask}
        {...props}>
        <LoadingView />
      </RoutedView>
      <RoutedView
        path='/jobs'  
        load={require('bundle-loader?lazy&name=ListHome!./lists/views/list.js')}
        listType={LIST_TYPES.jobs}
        {...props}>
        <LoadingView />
      </RoutedView>
      <RoutedView
        path='/jobs/:page'  
        load={require('bundle-loader?lazy&name=ListHome!./lists/views/list.js')}
        listType={LIST_TYPES.jobs}
        {...props}>
        <LoadingView />
      </RoutedView>
      <RoutedView
        path='/about'  
        load={require('bundle-loader?lazy&name=AboutHome!./about/views/about.js')}
        {...props}>
        <LoadingView />
      </RoutedView>
      <RoutedView
        path='/item/:id'  
        load={require('bundle-loader?lazy&name=ItemHome!./item/views/item.js')}
        name='ItemHome'
        {...props}>
        <LoadingView />
      </RoutedView>
      <RoutedView
        path='/user/:id'  
        load={require('bundle-loader?lazy&name=UserHome!./lists/views/user.js')}
        {...props}>
        <LoadingView />
      </RoutedView>
      <RoutedView
        path="/top/:page" default
        load={require('bundle-loader?lazy&name=ListHome!./lists/views/list.js')}
        listType={LIST_TYPES.top}
        {...props}>
      <LoadingView />
      </RoutedView>
    </Router>
  );
}