import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { tournamentLeaderboardExpandRow } from '../actions';
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

class TournamentLeaderboard extends Component {
  formatScore(score) {
    if (score === 0) return 'E';
    return score > 0 ? '+'+score : score;
  }

  formatMoney(money) {
    if (!money) return 'CUT';
    return '$'+money.toLocaleString();
  }

  render() {
    const { classes, leaderboard, isLoading, expandTournamentLeaderboardRow } = this.props;
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
                      <TableCell>Name</TableCell>
                      {leaderboard.tournamentStatus === 'closed' && (
                        <TableCell align="right">Money</TableCell>
                      )}
                      <TableCell align="right">Count</TableCell>
                      <TableCell align="right">Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaderboard.tournamentLeaderboard.map((player, idx) => (
                      <React.Fragment key={player.id}>
                        <TableRow selected={player.expanded} onClick={player.picks.length ? event => expandTournamentLeaderboardRow(player.id) : null}>
                          <TableCell component="th" scope="row" style={{paddingRight: 10, width: 5}}>
                            {player.position}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <Typography noWrap>
                               {player.first_name} {player.last_name}
                            </Typography>
                          </TableCell>
                          {leaderboard.tournamentStatus === 'closed' && (
                            <TableCell align="right">{this.formatMoney(player.money)}</TableCell>
                          )}
                          <TableCell align="right">{player.picks.length || '-'}</TableCell>
                          <TableCell align="right">{this.formatScore(player.score)}</TableCell>
                        </TableRow>
                        {player.expanded && (
                          <TableRow>
                            <TableCell colSpan={5}>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell style={{paddingRight: 10, width: 5}}>Pos</TableCell>
                                    <TableCell>Name</TableCell>
                                    {leaderboard.tournamentStatus === 'closed' && (
                                      <TableCell>Money</TableCell>
                                    )}
                                    <TableCell align="right">Avg Position</TableCell>
                                    <TableCell align="right">Score</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {player.picks.map(user => (
                                    <TableRow key={user.id}>
                                      <TableCell style={{paddingRight: 10, width: 5}}>{user.position}</TableCell>
                                      <TableCell>{user.username}</TableCell>
                                      {leaderboard.tournamentStatus === 'closed' && (
                                        <TableCell>{this.formatMoney(user.totalMoney) || 0}</TableCell>
                                      )}
                                      <TableCell align="right">{user.avgPosition}</TableCell>
                                      <TableCell align="right">{this.formatScore(user.totalScore)}</TableCell>
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

TournamentLeaderboard.propTypes = {
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
        expandTournamentLeaderboardRow: (id) => dispatch(tournamentLeaderboardExpandRow(id)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TournamentLeaderboard));
