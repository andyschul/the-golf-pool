import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saveProfile } from '../actions';
import ProfileForm from './ProfileForm'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Snackbar from '@material-ui/core/Snackbar'

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 9,
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    maxWidth: 700,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  header: {
    paddingBottom: theme.spacing.unit * 2,
  },
});

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {open: false, text: ''};
  }

  submit = async values => {
    let success = await this.props.saveProfile(values);
    let text = success ? 'Saved!' : 'Your profile could not be saved';
    this.setState({ open: true, text: text });
  }

  handleClose = (event, reason) => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          open={this.state.open}
          autoHideDuration={2000}
          onClose={this.handleClose}
          message={<span id="message-id">{this.state.text}</span>}
        />
        <Paper className={classes.root} elevation={1}>
          <Typography variant="h5" component="h3" className={classes.header}>
            Profile
          </Typography>
          <ProfileForm onSubmit={this.submit} />
        </Paper>
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveProfile: (data) => dispatch(saveProfile(data))
  };
};

export default connect(null, mapDispatchToProps)(withStyles(styles)(Profile));
