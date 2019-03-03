import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class SelectedListItem extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <List component="nav">
          <ListItem>
            <ListItemText primary="Group" />
          </ListItem>
          {this.props.rows.map((player, rowIdx) => (
            <ListItem button key={player.id}>
              <ListItemText primary={new Date(player.tee_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + ' - ' + player.first_name + ' ' + player.last_name + ' (' + player.country + ')'} />
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

SelectedListItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectedListItem);
