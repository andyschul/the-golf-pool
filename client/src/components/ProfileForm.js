import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import { fetchProfile } from '../actions';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 9,
    overflowX: 'auto',
  },
  table: {
    minWidth: 300,
  },
});

class ProfileForm extends Component {
  componentDidMount() {
    this.props.fetchProfile(`${process.env.REACT_APP_API_URL}/api/profile`);
  }
  render() {
    const { classes, handleSubmit } = this.props
    return (
      <form onSubmit={handleSubmit} className={classes.root}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <Field name="firstName" component="input" type="text" />
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <Field name="lastName" component="input" type="text" />
        </div>
        <button type="submit">Submit</button>
      </form>
    )
  }
}

ProfileForm = reduxForm({
  // a unique name for the form
  form: 'profile'
})(ProfileForm)

const mapStateToProps = (state) => {
  return {
    initialValues: state.profile,
    enableReinitialize: true
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchProfile: (url) => dispatch(fetchProfile(url))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProfileForm));
