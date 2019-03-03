import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import configureStore from './store/configureStore';
// import App from './components/App'

import ReactDOM from 'react-dom';
import { makeMainRoutes } from './routes';
require('dotenv').config({path: '../.env', silent: process.env.NODE_ENV === 'production'});

const routes = makeMainRoutes();
const store = configureStore();

render(
  <Provider store={store}>
    {routes}
  </Provider>,
  document.getElementById('root')
)






// import ReactDOM from 'react-dom';
// import './index.css';
// import * as serviceWorker from './serviceWorker';
// import { makeMainRoutes } from './routes';
// require('dotenv').config({path: '../.env', silent: process.env.NODE_ENV === 'production'});
//
// const routes = makeMainRoutes();
//
// ReactDOM.render(routes, document.getElementById('root'));
//
// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
