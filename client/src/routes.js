import React from 'react';
import { Route, Router } from 'react-router-dom';
import App from './components/App';
import TournamentGroupings from './components/TournamentGroupings';
import ButtonAppBar from './components/TopBar';
import Callback from './components/Callback';
import Auth from './Auth/Auth';
import history from './history';
import CssBaseline from '@material-ui/core/CssBaseline';

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
}

export const makeMainRoutes = () => {
  return (
    <Router history={history} component={App}>
      <div>
        <Route path="/" render={(props) => <ButtonAppBar auth={auth} {...props} />} />
        <Route path="/home" render={(props) => <App auth={auth} {...props} />} />
        <Route path="/test" render={(props) => <TournamentGroupings auth={auth} {...props} />} />
        <Route path="/callback" render={(props) => {
          handleAuthentication(props);
          return <Callback {...props} />
        }}/>
      </div>
    </Router>
  );
}
