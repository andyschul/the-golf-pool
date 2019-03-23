import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom';
import store from './store/configureStore';
import Routes from './routes';
import history from './history';
require('dotenv').config({path: '../.env', silent: process.env.NODE_ENV === 'production'});


render(
  <Provider store={store}>
    <Router history={history}>
      <Routes />
    </Router>
  </Provider>,
  document.getElementById('root')
)
