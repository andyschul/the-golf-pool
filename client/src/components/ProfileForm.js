import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import { fetchProfile } from '../actions';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import auth0Client from '../Auth/Auth';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  margin: {
    paddingTop: theme.spacing.unit * 2,
  },
});

const renderTextField = ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}) => (
  <TextField
    label={label}
    placeholder={label}
    error={touched && invalid}
    helperText={touched && error}
    {...input}
    {...custom}
  />
)

class ProfileForm extends Component {
  componentDidMount() {
    auth0Client.socket.emit('profile');
  }
  render() {
    const { classes, handleSubmit } = this.props
    return (
      <form onSubmit={handleSubmit} className={classes.container}>
        <Field name="firstName" label="First Name" className={classes.textField} component={renderTextField} type="text" />
        <Field name="lastName" label="Last Name" className={classes.textField} component={renderTextField} type="text" />
        <FormControl fullWidth className={classes.margin}>
          <Button variant="contained" color="primary" type="submit">Save</Button>
        </FormControl>
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
