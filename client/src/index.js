import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom';
import store from './store/configureStore';
import Routes from './routes';
import history from './history';
import io from 'socket.io-client';
import { scheduleFetchDataSuccess, yearlyLeaderboardFetchDataSuccess } from './actions';
import auth0Client from './Auth/Auth';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-client-preset'
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

require('dotenv').config({silent: process.env.NODE_ENV === 'production'});
const socket = io(process.env.REACT_APP_API_URL);


const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql'
})

const middlewareAuthLink = new ApolloLink((operation, forward) => {
  const token = auth0Client.getIdToken()
  const authorizationHeader = token
  operation.setContext({
    headers: {
      authorization: authorizationHeader
    }
  })
  return forward(operation)
})

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink)

const client = new ApolloClient({
  link: httpLinkWithAuthToken,
  cache: new InMemoryCache()
});

socket.on('tournament_schedule', function (schedule) {
  store.dispatch(scheduleFetchDataSuccess(schedule));
});
socket.on('yearly_leaderboard', function (yearlyLeaderboard) {
  store.dispatch(yearlyLeaderboardFetchDataSuccess(yearlyLeaderboard));
});

render(
  <Provider store={store}>
    <Router history={history}>
      <ApolloProvider client={client}>
        <Routes />
      </ApolloProvider>
    </Router>
  </Provider>,
  document.getElementById('root')
)
