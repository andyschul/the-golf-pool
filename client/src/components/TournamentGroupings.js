import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { groupsFetchData } from '../actions';
import { groupsCanSave } from '../actions';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import PlayerList from './PlayerList'

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 9,
    marginBottom: theme.spacing.unit * 9,
  },
});

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

class TournamentGroupings extends Component {
  constructor(props) {
    super(props);
    this.state = {open: false, text: ''};
  }

  componentDidMount() {
    this.props.fetchData(`${process.env.REACT_APP_API_URL}/api/users/${this.props.auth.id}/tournaments/${this.props.match.params.id}/groups?full=true`);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.props.canSave(false);
      this.props.fetchData(`${process.env.REACT_APP_API_URL}/api/users/${this.props.auth.id}/tournaments/${this.props.match.params.id}/groups?full=true`);
    }
  }

  componentWillUnmount() {
    this.props.canSave(false);
  }

  savePicks(groups) {
    let picks = [];
    for (let group of this.props.groups) {
      for (let player of group) {
        if (player.selected) {
          picks.push(player);
        }
      }
    }
    let self = this;
    axios.put(`${process.env.REACT_APP_API_URL}/api/users/${this.props.auth.id}/tournaments/${this.props.match.params.id}/picks`, {
      picks: picks
    })
    .then(function (response) {
      self.props.canSave(false);
      self.setState({ open: true, text: 'Saved!' });
    })
    .catch(function (error) {
      console.log(error);
      self.setState({ open: true, text: 'Your picks could not be saved' });
    });
  }

  cancelPicks() {
    this.props.fetchData(`${process.env.REACT_APP_API_URL}/api/users/${this.props.auth.id}/tournaments/${this.props.match.params.id}/groups?full=true`);
    this.props.canSave(false);
  }

  handleClose = (event, reason) => {
    this.setState({ open: false });
  };

  render() {
    const { classes, groups, groupsCanSave, handleClose, isLoading } = this.props;

    if (isLoading) {
      return (
        <div className={classes.root}>
          <Typography variant="h6" gutterBottom className={classes.root}>
            loading...
          </Typography>
        </div>
      )
    } else {
      return (
        <div className={classes.root}>
        {groups.length ?
          <React.Fragment>
            {groups.map((group, index) => (
              <PlayerList key={index} groupIndex={index} players={group} />
            ))}

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

            <Snackbar
              open={groupsCanSave}
              TransitionComponent={this.TransitionUp}
              ContentProps={{
                'aria-describedby': 'message-id',
              }}
              message={
                <div>
                <Button variant="contained" color="secondary" onClick={this.cancelPicks.bind(this)}>
                  Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={this.savePicks.bind(this)}>
                  Save
                </Button>
                </div>
              }
            />
          </React.Fragment>
        :

        <Typography variant="h6" gutterBottom className={classes.root}>
          An email will be sent out when the picks are available. Come check back soon!
        </Typography>
        }

        </div>
      );
    }
  }
}

TournamentGroupings.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    groups: state.groups,
    hasErrored: state.groupsHasErrored,
    isLoading: state.groupsIsLoading,
    groupsCanSave: state.groupsCanSave
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (url) => dispatch(groupsFetchData(url)),
    canSave: (bool) => dispatch(groupsCanSave(bool))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TournamentGroupings));
