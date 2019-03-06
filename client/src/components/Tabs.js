import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { scheduleFetchData } from '../actions';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import NoSsr from '@material-ui/core/NoSsr';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import TourneyGrouping from './TourneyGrouping'

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

function LinkTab(props) {
  return <Tab component="a" onClick={event => event.preventDefault()} {...props} />;
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

class NavTabs extends React.Component {
  state = {
    value: 0,
  };

  componentDidMount() {
    this.props.fetchData(`${process.env.REACT_APP_API_URL}/api/schedule/${new Date().getFullYear()}`);
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };


  render() {
    const { classes, schedule } = this.props;
    const { value } = this.state;

    return (
      <NoSsr>
        <div className={classes.root}>
          <AppBar position="static">
            <Tabs variant="fullWidth" value={value} onChange={this.handleChange}>
              {schedule.map(t => <LinkTab key={t.id} label={t.name} href={t.name} /> )}
            </Tabs>
          </AppBar>
          {schedule.map((t, idx) => (value === idx && <TabContainer key={t.id}><TourneyGrouping tournament={t.id} /></TabContainer>) )}
        </div>
      </NoSsr>
    );
  }
}

NavTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        schedule: state.schedule,
        hasErrored: state.scheduleHasErrored,
        isLoading: state.scheduleIsLoading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (url) => dispatch(scheduleFetchData(url))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(NavTabs));
