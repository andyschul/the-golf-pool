import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { leaderboardFetchData, leaderboardExpandRow } from '../actions';
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
    overflowX: 'auto',
  },
  table: {
    minWidth: 300,
  },
});

class GroupLeaderboard extends Component {
  formatScore(score) {
    if (score === 0) return 'E';
    return score > 0 ? '+'+score : score;
  }

  formatMoney(money) {
    if (!money) return 'CUT';
    return '$'+money.toLocaleString();
  }

  showWinners(pos) {
    switch(pos) {
      case 1:
        return `🥇`;
      case 2:
        return `🥈`;
      case 3:
        return `🥉`;
      default:
        return '';
    }
  }

  render() {
    const { classes, leaderboard, isLoading, expandLeaderboardRow } = this.props;
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
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell style={{paddingRight: 10, width: 5}}></TableCell>
                  <TableCell>Username</TableCell>
                  {leaderboard.tournamentStatus === 'closed' && (
                    <TableCell align="right">Money</TableCell>
                  )}
                  <TableCell align="right">Made Cuts</TableCell>
                  <TableCell align="right">Avg Position</TableCell>
                  <TableCell align="right">Combined Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboard.leaderboard.map((user, idx) => (
                  <React.Fragment key={user.id}>
                    <TableRow selected={user.expanded} onClick={event => expandLeaderboardRow(user.id)}>
                      <TableCell component="th" scope="row" style={{paddingRight: 10, width: 5}}>
                        {idx+1}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Typography noWrap>
                           {leaderboard.tournamentStatus === 'closed' && this.showWinners(idx+1)}
                           {user.username} {user.first_name ? `(${user.first_name} ${user.last_name})` : ''}
                        </Typography>
                      </TableCell>
                      {leaderboard.tournamentStatus === 'closed' && (
                        <TableCell align="right">{this.formatMoney(user.totalMoney)}</TableCell>
                      )}
                      <TableCell align="right">{user.totalMadeCuts}</TableCell>
                      <TableCell align="right">{user.avgPosition}</TableCell>
                      <TableCell align="right">{this.formatScore(user.totalScore)}</TableCell>
                    </TableRow>
                    {user.expanded && (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell style={{paddingRight: 10, width: 5}}>Pos</TableCell>
                                <TableCell>Name</TableCell>
                                {leaderboard.tournamentStatus === 'closed' && (
                                  <TableCell>Money</TableCell>
                                )}
                                <TableCell align="right">Score</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {user.picks.map(player => (
                                <TableRow key={player.id}>
                                  <TableCell style={{paddingRight: 10, width: 5}}>{player.position}</TableCell>
                                  <TableCell>{player.first_name + ' ' + player.last_name}</TableCell>
                                  {leaderboard.tournamentStatus === 'closed' && (
                                    <TableCell>{this.formatMoney(player.money) || 0}</TableCell>
                                  )}
                                  <TableCell align="right">{this.formatScore(player.score)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableCell>
                      </TableRow>
                    )}

                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </Paper>
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

GroupLeaderboard.propTypes = {
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
        fetchLeaderboard: (url) => dispatch(leaderboardFetchData(url)),
        expandLeaderboardRow: (id) => dispatch(leaderboardExpandRow(id)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(GroupLeaderboard));
