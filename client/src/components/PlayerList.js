import PropTypes from 'prop-types'
import Player from './Player'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectPlayer } from '../actions';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class PlayerList extends Component {
  render() {
    const { classes, players, groupIndex, selectPlayer } = this.props
    if (this.props.hasErrored) {
      return <p>Sorry! There was an error loading the items</p>;
    }
    if (this.props.isLoading) {
      return <p>Loading…</p>;
    }
    return (
      <div className={classes.root}>
        <List component="nav">
          <ListItem>
            <ListItemText primary="Group" />
          </ListItem>
          {players.map(player => (
            <Player key={player.id} {...player} onClick={() => selectPlayer(player.id, groupIndex)} />
          ))}
        </List>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectPlayer: (id, groupIndex) => dispatch(selectPlayer(id, groupIndex))
    };
};
export default connect(null, mapDispatchToProps)(withStyles(styles)(PlayerList));
