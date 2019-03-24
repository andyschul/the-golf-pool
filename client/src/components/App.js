import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import Layout from './Layout';
const backgroundImage = 'https://wallpaperbro.com/img/4442.jpg';


const styles = theme => ({
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
});

class App extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Layout backgroundClassName={classes.background}>
        <Typography color="inherit" align="center" variant="h3" marked="center" className={classes.h3}>
          The Masters
        </Typography>
        <Typography color="inherit" align="center" variant="h5" className={classes.h5}>
          April 14-19
        </Typography>
        <Button variant="contained" color="default" className={classes.button}>
          Make Picks
        </Button>
        <Button variant="contained" color="primary" className={classes.button2}>
          Leaderboard
        </Button>
      </Layout>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(App));
