import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { leaderboardExpandRow } from '../actions';
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

  formatWinners(name, pos) {
    switch(pos) {
      case 1:
        return `🥇${name}`;
      case 2:
        return `🥈${name}`;
      case 3:
        return `🥉${name}`;
      default:
        return name;
    }
  }

  render() {
    const { classes, leaderboard, isLoading, expandRow } = this.props;
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
                  <TableCell align="right">Avg Position</TableCell>
                  <TableCell align="right">Combined Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboard.leaderboard.map((user, idx) => (
                  <React.Fragment key={user.id}>
                    <TableRow selected={user.expanded} onClick={event => expandRow(user.id)}>
                      <TableCell component="th" scope="row" style={{paddingRight: 10, width: 5}}>
                        {idx+1}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Typography noWrap>
                           {leaderboard.tournamentStatus === 'closed' ? this.formatWinners(user.username, idx+1) : user.username}
                        </Typography>
                      </TableCell>
                      {leaderboard.tournamentStatus === 'closed' && (
                        <TableCell align="right">{this.formatMoney(user.totalMoney)}</TableCell>
                      )}
                      <TableCell align="right">{user.avgPosition}</TableCell>
                      <TableCell align="right">{this.formatScore(user.totalScore)}</TableCell>
                    </TableRow>
                    {user.expanded && (
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
        expandRow: (id) => dispatch(leaderboardExpandRow(id)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Leaderboard));
