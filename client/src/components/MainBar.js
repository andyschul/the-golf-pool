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
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import ExitToApp from '@material-ui/icons/ExitToApp';
import { setGroupVisibilityFilter, setLeaderboardVisibilityFilter } from '../actions';
import auth0Client from '../Auth/Auth';
import history from '../history';

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
    history.push(`/${route}`);
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  toggleGroup = name => event => {
    let filter = event.target.checked ? 'SHOW_SAVED' : 'SHOW_ALL';
    this.props.setGroupVisibilityFilter(filter);
  };

  toggleLeaderboard = name => event => {
    let filter = event.target.checked ? 'SHOW_MY_PICKS' : 'SHOW_ALL';
    this.props.setLeaderboardVisibilityFilter(filter);
  };

  handleLogout = () => {
    auth0Client.signOut();
  };

  render() {
    const { classes, schedule, groupVisibilityFilter, leaderboardVisibilityFilter, match, profile } = this.props;

    const sideList = (
      <div className={classes.list}>
        <List>
          {schedule.tournaments.map((tournament, index) => (
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
                <ListItem button onClick={this.goTo.bind(this, `tournaments/${tournament.id}/groups`)}>
                  <ListItemText secondary={'Make Picks'} />
                </ListItem>
                <ListItem button onClick={this.goTo.bind(this, `tournaments/${tournament.id}/leaderboard`)}>
                  <ListItemText secondary={'Leaderboard'} />
                </ListItem>
              </div>
              </List>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
        </List>

        <Divider />
        <List onClick={this.toggleDrawer('left', false)}>
          <ListItem button onClick={this.goTo.bind(this, '')}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary='Home' />
          </ListItem>
          <ListItem button onClick={this.goTo.bind(this, 'profile')}>
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary='Profile' />
          </ListItem>
          {profile.admin ? 
            <ListItem button onClick={this.goTo.bind(this, 'admin')}>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary='Admin' />
            </ListItem> :
            ''
          }
          <ListItem button onClick={this.handleLogout}>
            <ListItemIcon><ExitToApp /></ListItemIcon>
            <ListItemText primary='Logout' />
          </ListItem>
        </List>
      </div>
    );

    const barContent = (page) => {
      switch (page) {
        case '/profile':
          return (
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Profile
            </Typography>
          );
        case '/tournaments/:id/groups':
          return (
            <React.Fragment>
              <Typography variant="h6" color="inherit" className={classes.grow}>
                Picks
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={groupVisibilityFilter === 'SHOW_SAVED' ? true : false}
                    onChange={this.toggleGroup('checkedB')}
                    value="checkedB"
                    color="primary"
                  />
                }
                label="My Picks"
              />
            </React.Fragment>
          );
        case '/tournaments/:id/leaderboard':
          return (
            <React.Fragment>
              <Typography variant="h6" color="inherit" className={classes.grow}>
                Leaderboard
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={leaderboardVisibilityFilter === 'SHOW_MY_PICKS' ? true : false}
                    onChange={this.toggleLeaderboard('checkedB')}
                    value="checkedA"
                    color="primary"
                  />
                }
                label="My Picks"
              />
            </React.Fragment>
          );
        default:
          return;
      }
    }

    return (
      <div className={classes.root}>
        <AppBar position="fixed" color="default">
          <Toolbar>
            <IconButton onClick={this.toggleDrawer('left', true)} className={classes.menuButton} color="inherit" aria-label="Menu">
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
            {barContent(match.path)}
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
    profile: state.profile,
    schedule: state.schedule,
    groupVisibilityFilter: state.groupVisibilityFilter,
    leaderboardVisibilityFilter: state.leaderboardVisibilityFilter,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setGroupVisibilityFilter: (filter) => dispatch(setGroupVisibilityFilter(filter)),
    setLeaderboardVisibilityFilter: (filter) => dispatch(setLeaderboardVisibilityFilter(filter)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MainBar));
