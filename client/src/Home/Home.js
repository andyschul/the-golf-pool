import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import SelectedListItem from './List'


class Home extends Component {
  state = {
    isMounted: false,
    groups: []
  }
  componentDidMount() {
      this.setState({isMounted: true})
  }
  componentWillUnmount(){
      this.setState({isMounted: false})
  }
  ping() {
    console.log(`${process.env.REACT_APP_API_URL}/api/groupings`)
    axios.get(`${process.env.REACT_APP_API_URL}/api/groupings`)
      .then((response) => {
        this.setState({
          groups: response.data.groups
        });
      })
      .catch(function (error) {
        alert('There was an error submitting settings.');
      });
  }

  onGroupClick() {
    console.log('clicked');
  }

  callApi = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/groupings`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  render() {
    const { isAuthenticated } = this.props.auth;
    return (
      <Grid container spacing={24} style={{paddingTop: 70, paddingLeft: 5, paddingRight: 5, paddingBottom: 60}}>
        <Grid item xs={12}>
        {
          isAuthenticated() && (
            <div>
              You are logged in!
            </div>
            )
        }
        {
          !isAuthenticated() && (
              <h4>
                You are not logged in! Please Log In to continue.
              </h4>
            )
        }
        <div>
          <button
            onClick={this.ping.bind(this)}
          >
            Call API
          </button>
          {this.state.groups.map((group, index) => (
            <SelectedListItem key={index} {...group} onClick={() => this.onGroupClick(index)}/>
          ))}
        </div>
        </Grid>
      </Grid>
    );
  }
}

export default Home;
