import {h, render} from 'preact';
import {Router} from 'preact-router';

import RoutedView from './core/routedView.js';
import LoadingView from './core/loadingView.js';
import './core/api/memory.js';

import './reset.css';

const mountElement = document.getElementById('mount');

render((
  <Router>
    <RoutedView
      path='/new'  
      load={require('bundle-loader?lazy&name=NewHome!./lists/views/new.js')}
      name='NewHome'>
      <LoadingView />
    </RoutedView>
    <RoutedView
      path='/show'  
      load={require('bundle-loader?lazy&name=ShowHome!./lists/views/show.js')}
      name='ShowHome'>
      <LoadingView />
    </RoutedView>
    <RoutedView
      path='/ask'  
      load={require('bundle-loader?lazy&name=AskHome!./lists/views/ask.js')}
      name='AskHome'>
      <LoadingView />
    </RoutedView>
    <RoutedView
      path='/jobs'  
      load={require('bundle-loader?lazy&name=JobsHome!./lists/views/jobs.js')}
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
      load={require('bundle-loader?lazy&name=TopHome!./lists/views/top.js')}
      name='TopHome'>
     <LoadingView />
    </RoutedView>
  </Router>
), null, mountElement);

const serviceWorkerConfig = document.getElementById('config.serviceworker');
if ('serviceWorker' in navigator && serviceWorkerConfig) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(serviceWorkerConfig.content).then((registration) => {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch((err) => {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}