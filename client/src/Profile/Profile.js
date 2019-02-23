import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  container: {
    paddingTop: 80,
    paddingLeft: 5,
    paddingRight: 5,
  }
});

function CenteredGrid(props) {
  const { classes } = props;

  return (
    <Grid container spacing={24} style={{paddingTop: 70, paddingLeft: 5, paddingRight: 5, paddingBottom: 60}}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>xs=12</Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper className={classes.paper}>xs=6</Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper className={classes.paper}>xs=6</Paper>
      </Grid>
      <Grid item xs={3}>
        <Paper className={classes.paper}>xs=3</Paper>
      </Grid>
      <Grid item xs={3}>
        <Paper className={classes.paper}>xs=3</Paper>
      </Grid>
      <Grid item xs={3}>
        <Paper className={classes.paper}>xs=3</Paper>
      </Grid>
      <Grid item xs={3}>
        <Paper className={classes.paper}>xs=3</Paper>
      </Grid>
    </Grid>
  );
}

CenteredGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CenteredGrid);
