import React, { Component } from 'react';
import ProfileForm from './ProfileForm'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar'
import auth0Client from '../Auth/Auth';

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

class Admin extends Component {
//   TODO: get users
//   componentDidMount() {
//     auth0Client.socket.emit('users');
//   }
  constructor(props) {
    super(props);
    this.state = {open: false, text: ''};
  }

  submit = async values => {
    let self = this;
    auth0Client.socket.emit('update profile', values, function(success) {
      let text = success ? 'Profile saved!' : 'Your profile could not be saved';
      self.setState({ open: true, text: text });
    })
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
          <ProfileForm onSubmit={this.submit} />
        </Paper>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Admin);
