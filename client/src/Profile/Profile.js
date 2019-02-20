import React, { Component } from 'react';

class Profile extends Component {
  render() {
    const { isAuthenticated, login } = this.props.auth;
    return (
      <div className="container">
        This is the profile!
      </div>
    );
  }
}

export default Profile;
