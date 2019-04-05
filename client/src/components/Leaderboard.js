import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { leaderboardFetchData } from '../actions';
import TournamentLeaderboard from './TournamentLeaderboard';
import GroupLeaderboard from './GroupLeaderboard';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

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
    this.props.fetchLeaderboard(`${process.env.REACT_APP_API_URL}/api/tournaments/${this.props.match.params.id}/leaderboard`);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.props.fetchLeaderboard(`${process.env.REACT_APP_API_URL}/api/tournaments/${this.props.match.params.id}/leaderboard`);
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
              <Tab label="Group Leaderboard" />
              <Tab label="Tournament Leaderboard" />
            </Tabs>
            {value === 0 && <TabContainer><GroupLeaderboard /></TabContainer>}
            {value === 1 && <TabContainer><TournamentLeaderboard /></TabContainer>}
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

const mapDispatchToProps = (dispatch) => {
    return {
        fetchLeaderboard: (url) => dispatch(leaderboardFetchData(url))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Leaderboard));
