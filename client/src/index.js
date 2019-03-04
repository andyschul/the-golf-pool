import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore';
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
