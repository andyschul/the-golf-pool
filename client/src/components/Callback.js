import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
    marginTop: 300,
  },
});

class Callback extends Component {
  render() {
    const style = {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
    }
    const { classes } = this.props;
    return (
      <div style={style}>
        <CircularProgress className={classes.progress} />
      </div>
    );
  }
}

export default withStyles(styles)(Callback);
