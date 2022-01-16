import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import App from './components/App';
import Profile from './components/Profile';
import Admin from './components/Admin';
import Leaderboard from './components/Leaderboard';
import VisibleGroupList from './containers/VisibleGroupList';
import MainBar from './components/MainBar';
import Callback from './components/Callback';
import auth0Client from './Auth/Auth';
import history from './history';

function SecuredRoute(props) {
  const {component: Component, path, checkingSession} = props;
  return (
    <Route path={path} render={(props) => {
      if (checkingSession) return <h3 className="text-center">Validating session...</h3>;
        if (!auth0Client.isAuthenticated()) {
          auth0Client.signIn();
          return <div></div>;
        }
        return (
          <React.Fragment>
            <MainBar {...props} />
            <Component {...props} />
          </React.Fragment>
        )
    }} />
  );
}

class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkingSession: true,
    }
  }

  async componentDidMount() {
    if (history.location === '/callback') {
      this.setState({checkingSession:false});
      return;
    }
    try {
      await auth0Client.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error !== 'login_required') console.log(err.error);
    }
    this.setState({checkingSession:false});
  }

  render() {
    return (
      <div>
        <Route exact path='/callback' component={Callback}/>
        <Route exact path='/' component={MainBar} />
        <Route exact path='/' component={App} />
        <SecuredRoute path="/profile" component={Profile} checkingSession={this.state.checkingSession} />
        <SecuredRoute path="/admin" component={Admin} checkingSession={this.state.checkingSession} />
        <SecuredRoute path="/tournaments/:id/groups" component={VisibleGroupList} checkingSession={this.state.checkingSession} />
        <SecuredRoute path="/tournaments/:id/leaderboard" component={Leaderboard} checkingSession={this.state.checkingSession} />
      </div>
    );
  }
}

export default Routes;
