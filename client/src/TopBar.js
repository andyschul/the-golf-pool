import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';

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

class ButtonAppBar extends React.Component {
  state = {
    left: false,
  };

  login() {
    this.props.auth.login();
  }
  logout() {
    this.props.auth.logout();
  }

  goTo = (route) => {
    this.props.history.replace(`/${route}`)
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  render() {
    const { isAuthenticated } = this.props.auth;
    const { classes } = this.props;

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
            <ListItem button onClick={this.logout.bind(this)}>
              <ListItemText primary="Logout" />
            </ListItem>
        </List>
      </div>
    );

    return (
      <div className={this.props.classes.root}>
        <AppBar position="fixed" color="default">
          <Toolbar>
            {
              isAuthenticated() && (
                <IconButton onClick={this.toggleDrawer('left', true)} className={this.props.classes.menuButton} color="inherit" aria-label="Menu">
                  <MenuIcon />
                </IconButton>
                )
            }
            <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
              <div
                tabIndex={0}
                role="button"
                onClick={this.toggleDrawer('left', false)}
                onKeyDown={this.toggleDrawer('left', false)}
              >
                {sideList}
              </div>
            </Drawer>

            <Typography variant="h6" color="inherit" className={this.props.classes.grow}>

            </Typography>
            {
              !isAuthenticated() && (
                <Button color="inherit" onClick={this.login.bind(this)}>Login</Button>
                )
            }
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);
