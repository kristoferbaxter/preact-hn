import {h, render} from 'preact';
import {Router} from 'preact-router';

import RoutedView from './core/routedView.js';
import LoadingView from './core/loadingView.js';
import LIST_TYPES from './restify/storage/list-types.js';
import './core/api/memory.js';

import './reset.css';

render((
  <Router>
    <RoutedView
      path='/new'  
      load={require('bundle-loader?lazy&name=ListHome!./lists/views/listWithType.js')}
      listType={LIST_TYPES.new}
      name='NewHome'>
      <LoadingView />
    </RoutedView>
    <RoutedView
      path='/show'  
      load={require('bundle-loader?lazy&name=ListHome!./lists/views/listWithType.js')}
      listType={LIST_TYPES.show}
      name='ShowHome'>
      <LoadingView />
    </RoutedView>
    <RoutedView
      path='/ask'  
      load={require('bundle-loader?lazy&name=ListHome!./lists/views/listWithType.js')}
      listType={LIST_TYPES.ask}
      name='AskHome'>
      <LoadingView />
    </RoutedView>
    <RoutedView
      path='/jobs'  
      load={require('bundle-loader?lazy&name=ListHome!./lists/views/listWithType.js')}
      listType={LIST_TYPES.jobs}
      name='JobsHome'>
      <LoadingView />
    </RoutedView>
    <RoutedView
      path='/about'  
      load={require('bundle-loader?lazy&name=AboutHome!./about/views/about.js')}
      name='AboutHome'>
      <LoadingView />
    </RoutedView>
    <RoutedView
      path='/item/:id'  
      load={require('bundle-loader?lazy&name=ItemHome!./item/views/item.js')}
      name='ItemHome'>
      <LoadingView />
    </RoutedView>
    <RoutedView
      path='/user/:id'  
      load={require('bundle-loader?lazy&name=UserHome!./lists/views/user.js')}
      name='UserHome'>
      <LoadingView />
    </RoutedView>
    <RoutedView
      path="/" default
      load={require('bundle-loader?lazy&name=ListHome!./lists/views/listWithType.js')}
      listType={LIST_TYPES.top}
      name='TopHome'>
     <LoadingView />
    </RoutedView>
  </Router>
), null, document.getElementById('mount'));

require('offline-plugin/runtime').install();
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch((err) => {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
*/