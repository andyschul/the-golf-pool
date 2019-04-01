import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { yearlyLeaderboardExpandRow } from '../actions';
import Layout from './Layout';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import history from '../history';

const backgroundImage = 'https://wallpaperbro.com/img/4442.jpg';


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 9,
    overflowX: 'auto',
  },
  table: {
    minWidth: 300,
  },
  background: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundColor: '#39ae50', // Average color of the background image.
    backgroundPosition: 'center',
  },
  button: {
    minHeight: 50,
    minWidth: 200,
    marginTop: theme.spacing.unit * 2,
  },
  button2: {
    minHeight: 50,
    minWidth: 200,
    marginTop: theme.spacing.unit * 5,
  },
  h3: {
    marginTop: theme.spacing.unit * 10,
  },
  h5: {
    marginBottom: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit * 4,
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing.unit * 10,
    },
  },
  header: {
    margin: theme.spacing.unit,
  },
});

class App extends React.Component {

  formatMoney(money) {
    if (!money) return 'CUT';
    return '$'+money.toLocaleString();
  }

  goTo = (route) => {
    history.push(`/${route}`);
  }

  render() {
    const { classes, schedule, yearlyLeaderboard, expandRow } = this.props;

    return (
      <div>
      <Layout backgroundClassName={classes.background}>
        <Typography color="inherit" align="center" variant="h3" marked="center" className={classes.h3}>
          {schedule.currentTournament.name}
        </Typography>
        <Typography color="inherit" align="center" variant="h5" className={classes.h5}>
          {schedule.currentTournament.start_date && (
            `${new Date(`${schedule.currentTournament.start_date}T00:00:00`).toLocaleString('en-us', { timeZone: 'America/New_York', month: 'long', day: 'numeric' })}
            -
            ${new Date(`${schedule.currentTournament.end_date}T00:00:00`).toLocaleString('en-us', { timeZone: 'America/New_York', day: 'numeric' })}`
          )}
        </Typography>
        <Button variant="contained"
                color="default"
                className={classes.button}
                onClick={this.goTo.bind(this, `tournaments/${schedule.currentTournament.id}/groups`)}
        >
          Make Picks
        </Button>
        <Button variant="contained"
                color="primary"
                className={classes.button2}
                onClick={this.goTo.bind(this, `tournaments/${schedule.currentTournament.id}/leaderboard`)}
        >
          Leaderboard
        </Button>
      </Layout>

      <Paper className={classes.root}>
        <Typography variant="h5" component="h3" align="center" className={classes.header}>
          Yearly Leaderboard
        </Typography>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell style={{paddingRight: 10, width: 5}}></TableCell>
              <TableCell>Username</TableCell>
              <TableCell align="right">Made Cuts</TableCell>
              <TableCell align="right">Total Money</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {yearlyLeaderboard.map((user, idx) => (
              <React.Fragment key={user.id}>
                <TableRow selected={user.expanded} onClick={event => expandRow(user.id)}>
                  <TableCell component="th" scope="row" style={{paddingRight: 10, width: 5}}>
                    {idx+1}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Typography noWrap>
                       {user.username} {user.first_name ? `(${user.first_name} ${user.last_name})` : ''}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{user.yearlyTotalMadeCuts}</TableCell>
                  <TableCell align="right">{this.formatMoney(user.yearlyTotalMoney)}</TableCell>
                </TableRow>
                {user.expanded && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Made Cuts</TableCell>
                            <TableCell align="right">Money</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {user.tournaments.map(tour => (
                            <TableRow key={tour.id}>
                              <TableCell>{tour.name}</TableCell>
                              <TableCell align="right">{tour.totalMadeCuts}</TableCell>
                              <TableCell align="right">{this.formatMoney(tour.totalMoney)}</TableCell>
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
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    schedule: state.schedule,
    yearlyLeaderboard: state.yearlyLeaderboard,
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
        expandRow: (id) => dispatch(yearlyLeaderboardExpandRow(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App));
