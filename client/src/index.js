import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom';
import store from './store/configureStore';
import Routes from './routes';
import history from './history';
import io from 'socket.io-client';
import { scheduleFetchDataSuccess, yearlyLeaderboardFetchDataSuccess } from './actions';
require('dotenv').config({silent: process.env.NODE_ENV === 'production'});
const socket = io(process.env.REACT_APP_API_URL);

socket.on('tournament_schedule', function (schedule) {
  store.dispatch(scheduleFetchDataSuccess(schedule));
});
socket.on('yearly_leaderboard', function (yearlyLeaderboard) {
  store.dispatch(yearlyLeaderboardFetchDataSuccess(yearlyLeaderboard));
});

render(
  <Provider store={store}>
    <Router history={history}>
      <Routes />
    </Router>
  </Provider>,
  document.getElementById('root')
)
