import React, { Component } from 'react';
import { Route, Router, Redirect } from 'react-router-dom';
import App from './components/App';
import Login from './components/Login';
import Leaderboard from './components/Leaderboard';
import TournamentGroupings from './components/TournamentGroupings';
import MainBar from './components/MainBar';
import Callback from './components/Callback';
import auth0Client from './Auth/Auth';
import history from './history';

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth0Client.handleAuthentication();
  }
}

class ProtectedRoute extends Component {
  render() {
    const { component: Component, ...props } = this.props
    return (
      <Route
        {...props}
        render={props => (
          auth0Client.isAuthenticated() ?
            <Component {...props} /> :
            <Redirect to='/login' />
        )}
      />
    )
  }
}

export const makeMainRoutes = () => {
  return (
    <Router history={history} component={App}>
      <div>
        <Route path="/login" render={(props) => <Login {...props} />} />
        <Route path="/callback" render={(props) => {
          handleAuthentication(props);
          return <Callback {...props} />
        }}/>
        <ProtectedRoute path="/" component={MainBar} />
        <ProtectedRoute exact path="/" component={App} />
        <ProtectedRoute path="/tournaments/:id/groups" component={TournamentGroupings} />
        <ProtectedRoute path="/tournaments/:id/leaderboard" component={Leaderboard} />
      </div>
    </Router>
  );
}
