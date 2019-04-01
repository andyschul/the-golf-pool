import React, { Component } from 'react';
import ProfileForm from './ProfileForm'
import { connect } from 'react-redux';
import { saveProfile } from '../actions';

class Profile extends Component {
  submit = values => {
    this.props.saveProfile(values)
  }
  render() {
    return <ProfileForm onSubmit={this.submit} />
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveProfile: (data) => dispatch(saveProfile(data))
  };
};

export default connect(null, mapDispatchToProps)(Profile);
