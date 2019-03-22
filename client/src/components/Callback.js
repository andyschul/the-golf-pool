import React, {Component} from 'react';
import auth0Client from '../Auth/Auth';
import history from '../history';

class Callback extends Component {
  async componentDidMount() {
    await auth0Client.handleAuthentication();
    history.replace('/');
  }

  render() {
    return (
      <p>Loading...</p>
    );
  }
}

export default Callback;
