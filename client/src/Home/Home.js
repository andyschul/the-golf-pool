import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { API_URL } from '../constants';
import axios from 'axios';
import SimpleTable from './Table'




class Home extends Component {
  state = {
    isMounted: false,
    groups: []
  }
  componentDidMount() {
      this.setState({isMounted: true})
  }
  componentWillUnmount(){
      this.state.isMounted = false
  }
  ping() {
    axios.get(`/api/groupings`)
      .then((response) => {
        this.setState({
          groups: response.data.groups
        });
      })
      .catch(function (error) {
        alert('There was an error submitting settings.');
      });
  }
  callApi = async () => {
    const response = await fetch(`/api/groupings`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  render() {
    const { isAuthenticated, login } = this.props.auth;
    return (
      <Grid container spacing={24} style={{paddingTop: 70, paddingLeft: 5, paddingRight: 5, paddingBottom: 60}}>
        <Grid item xs={12}>
        {
          isAuthenticated() && (
              <button
                onClick={this.ping.bind(this)}
              >
                Call API
              </button>
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
        <button
          onClick={this.ping.bind(this)}
        >
          Call API
        </button>
        </Grid>
        {this.state.groups.map((group, index) => (
          <SimpleTable rows={group} tableIndex={index}/>
        ))}

      </Grid>
    );
  }
}

export default Home;
