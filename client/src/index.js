import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom';
import store from './store/configureStore';
import Routes from './routes';
import history from './history';
import io from 'socket.io-client';
import { scheduleFetchData, yearlyLeaderboardFetchData, leaderboardFetchDataSuccess } from './actions';
require('dotenv').config({silent: process.env.NODE_ENV === 'production'});
const socket = io(process.env.REACT_APP_API_URL);
socket.on('connect', function() {
  store.dispatch(scheduleFetchData(`${process.env.REACT_APP_API_URL}/api/schedule/${new Date().getFullYear()}`));
  store.dispatch(yearlyLeaderboardFetchData(`${process.env.REACT_APP_API_URL}/api/schedule/${new Date().getFullYear()}/leaderboard`));
});

socket.on('leaderboard', function (data) {
  console.log(data);
  store.dispatch(leaderboardFetchDataSuccess(data));
});

render(
  <Provider store={store}>
    <Router history={history}>
      <Routes />
    </Router>
  </Provider>,
  document.getElementById('root')
)
