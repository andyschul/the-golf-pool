import React from 'react';
import { Route, Router } from 'react-router-dom';
import App from './App';
import ButtonAppBar from './TopBar';
import Home from './Home/Home';
import Profile from './Profile/Profile';
import Callback from './Callback/Callback';
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
    <React.Fragment>
      <CssBaseline />
      <Router history={history} component={App}>
        <div>
          <Route path="/" render={(props) => <ButtonAppBar auth={auth} {...props} />} />
          <Route path="/home" render={(props) => <Home auth={auth} {...props} />} />
          <Route path="/profile" render={(props) => <Profile auth={auth} {...props} />} />
          <Route path="/callback" render={(props) => {
            handleAuthentication(props);
            return <Callback {...props} />
          }}/>
        </div>
      </Router>
    </React.Fragment>
  );
}
