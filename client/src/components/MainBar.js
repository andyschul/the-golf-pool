import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import { groupsFetchData } from '../actions';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class MainBar extends React.Component {
  state = {
    left: false,
  };

  goTo = (route) => {
    this.props.history.replace(`/tournaments/${route}`);
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  render() {
    const { classes, schedule } = this.props;

    const sideList = (
      <div className={classes.list}>
        <List>
          {[{page: 'Home', icon: <HomeIcon />}, {page: 'Profile', icon: <PersonIcon />}].map((item, index) => (
            <ListItem button key={item.page} onClick={this.goTo.bind(this, item.page.toLowerCase())}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.page} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {schedule.map((tournament, index) => (
            <ExpansionPanel key={tournament.id}>
              <ExpansionPanelSummary>
                <ListItem>
                  <ListItemText primary={tournament.name} />
                </ListItem>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
              <List>
              <div
                tabIndex={0}
                role="button"
                onClick={this.toggleDrawer('left', false)}
              >
                <ListItem button onClick={this.goTo.bind(this, `${tournament.id}/picks`)}>
                  <ListItemText secondary={'Make Picks'} />
                </ListItem>
                <ListItem button onClick={this.goTo.bind(this, `${tournament.id}/results`)}>
                  <ListItemText secondary={'Results'} />
                </ListItem>
              </div>
              </List>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
        </List>

        <Divider />
        <List>
            <ListItem button>
              <ListItemText primary="Logout" />
            </ListItem>
        </List>
      </div>
    );

    return (
      <div className={this.props.classes.root}>
        <AppBar position="fixed" color="default">
          <Toolbar>
            <IconButton onClick={this.toggleDrawer('left', true)} className={this.props.classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
              <div
                tabIndex={0}
                role="button"
              >
                {sideList}
              </div>
            </Drawer>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

MainBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    schedule: state.schedule,
    hasErrored: state.scheduleHasErrored,
    isLoading: state.scheduleIsLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (url) => dispatch(groupsFetchData(url))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MainBar));
