import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import PlayerList from './PlayerList'

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 9,
    marginBottom: theme.spacing.unit * 9,
  },
  popper: {
    width: 300
  },
  actionBtn: {
    width: 100
  },
});

class TournamentGroupings extends Component {
  constructor(props) {
    super(props);
    this.state = {open: false, text: ''};
  }

  componentDidMount() {
    this.props.fetchData(`${process.env.REACT_APP_API_URL}/api/tournaments/${this.props.match.params.id}/groups?full=true`);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.props.canSave(false);
      this.props.fetchData(`${process.env.REACT_APP_API_URL}/api/tournaments/${this.props.match.params.id}/groups?full=true`);
    }
  }

  componentWillUnmount() {
    this.props.canSave(false);
  }


  handlePicks = async groups => {
    let data = {picks: []};
    for (let group of this.props.groups) {
      let players = group.filter(p=>p.selected || p.saved);
      if (players.length) {
        let selected = players.filter(p=>p.selected).pop();
        if (selected) {
          data.picks.push(selected);
        } else {
          data.picks.push(players.filter(p=>p.saved).pop());
        }
      }
    }

    let url = `${process.env.REACT_APP_API_URL}/api/tournaments/${this.props.match.params.id}/picks`;
    let success = await this.props.savePicks(url, data);
    if (success) {
      this.props.canSave(false);
      this.setState({ open: true, text: 'Saved!' });
    } else {
      this.setState({ open: true, text: 'Your picks could not be saved' });
    }
  }



  cancelPicks() {
    this.props.cancelPicks();
    this.props.canSave(false);
  }

  handleClose = (event, reason) => {
    this.setState({ open: false });
  };

  render() {
    const { classes, groups, groupsCanSave, isLoading } = this.props;

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
                <div className={classes.popper}>
                  <Grid container justify="center">
                    <Grid item xs={6}>
                      <Button variant="contained" color="secondary" className={classes.actionBtn} onClick={this.cancelPicks.bind(this)}>
                        Cancel
                      </Button>
                    </Grid>
                    <Grid item container xs={6} alignItems="flex-end" direction="column" spacing={0}>
                      <Grid item>
                        <Button variant="contained" color="primary" className={classes.actionBtn} onClick={this.handlePicks.bind(this)}>
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
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

export default withStyles(styles)(TournamentGroupings);
