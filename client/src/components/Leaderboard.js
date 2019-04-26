import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { leaderboardFetchData } from '../actions';
import VisibleLeaderboard from '../containers/VisibleLeaderboard';
import GroupLeaderboard from './GroupLeaderboard';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import auth0Client from '../Auth/Auth';


function TabContainer(props) {
  return (
    <Typography component="div">
      {props.children}
    </Typography>
  );
}

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

class Leaderboard extends Component {
  state = {
    value: 0,
  };

  componentDidMount() {
    auth0Client.socket.emit('leaderboard', this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      auth0Client.socket.emit('leaderboard', this.props.match.params.id);
    }
  }
  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, leaderboard, isLoading } = this.props;
    const { value } = this.state;
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
        <React.Fragment>
        {leaderboard.leaderboard.length ?
          <div className={classes.root}>
            <Tabs
              value={value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Group" />
              <Tab label="Tournament" />
            </Tabs>
            {value === 0 && <TabContainer><GroupLeaderboard /></TabContainer>}
            {value === 1 && <TabContainer><VisibleLeaderboard /></TabContainer>}
          </div>
          :
          <Typography variant="h6" gutterBottom className={classes.root}>
            Leaderboard will be available at 7PM on day 1 of the tournament
          </Typography>
        }
        </React.Fragment>

      );
    }
  }
}

Leaderboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    leaderboard: state.leaderboard,
    hasErrored: state.leaderboardHasErrored,
    isLoading: state.leaderboardIsLoading
  };
};

export default connect(mapStateToProps, null)(withStyles(styles)(Leaderboard));
