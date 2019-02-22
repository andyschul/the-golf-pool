import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';

class Home extends Component {
  render() {
    const { isAuthenticated, login } = this.props.auth;
    return (
      <Grid container spacing={24} style={{paddingTop: 70, paddingLeft: 5, paddingRight: 5, paddingBottom: 60}}>
        <Grid item xs={12}>
        {
          isAuthenticated() && (
              <h4>
                You are logged in!
              </h4>
            )
        }
        {
          !isAuthenticated() && (
              <h4>
                You are not logged in! Please{' '}
                <a style={{cursor:'pointer'}}
                  onClick={login.bind(this)}
                >
                  Log In
                </a>
                {' '}to continue.
              </h4>
            )
        }
        </Grid>
      </Grid>
    );
  }
}

export default Home;
