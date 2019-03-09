import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { leaderboardFetchData } from '../actions';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

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
  componentDidMount() {
    this.props.fetchLeaderboard(`${process.env.REACT_APP_API_URL}/api/tournaments/${this.props.match.params.id}/leaderboard`);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.props.fetchLeaderboard(`${process.env.REACT_APP_API_URL}/api/tournaments/${this.props.match.params.id}/leaderboard`);
    }
  }

  formatScore(score) {
    if (score === 0) return 'E';
    return score > 0 ? '+'+score : score;
  }

  formatMoney(money) {
    if (!money) return 'CUT';
    return '$'+money.toLocaleString();
  }

  render() {
    const { classes, leaderboard } = this.props;
    return (
<React.Fragment>
      {leaderboard.leaderboard.length ?
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="right">Score</TableCell>
                {leaderboard.tournamentStatus !== 'closed' && (
                  <TableCell align="right">Money</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboard.leaderboard.map((user, idx) => (
                <React.Fragment key={user.id}>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {idx+1}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {user.username}
                    </TableCell>
                    <TableCell align="right">{user.totalScore}</TableCell>
                    {leaderboard.tournamentStatus !== 'closed' && (
                      <TableCell align="right">{this.formatMoney(user.totalMoney)}</TableCell>
                    )}

                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Score</TableCell>
                            {leaderboard.tournamentStatus !== 'closed' && (
                              <TableCell>Money</TableCell>
                            )}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {user.picks.map(player => (
                            <TableRow key={player.id}>
                              <TableCell>{player.first_name + ' ' + player.last_name}</TableCell>
                              <TableCell align="right">{this.formatScore(player.score)}</TableCell>
                              {leaderboard.tournamentStatus !== 'closed' && (
                                <TableCell>{this.formatMoney(player.money) || 0}</TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </Paper>
        :
        <Typography variant="h6" gutterBottom className={classes.root}>
          Leaderboard will be availbale on day 2 of the tournament
        </Typography>
      }
</React.Fragment>

    );
  }
}

Leaderboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    leaderboard: state.leaderboard,
    hasErrored: state.leaderboardHasErrored,
    isLoading: state.leaderboardIsLoading
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchLeaderboard: (url) => dispatch(leaderboardFetchData(url)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Leaderboard));
