import Player from './Player'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectPlayer } from '../actions';
import { groupsCanSave } from '../actions';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import red from '@material-ui/core/colors/red';
import pink from '@material-ui/core/colors/pink';
import purple from '@material-ui/core/colors/purple';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';
import orange from '@material-ui/core/colors/orange';
import brown from '@material-ui/core/colors/brown';
import grey from '@material-ui/core/colors/grey';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  0: {
    backgroundColor: red[500],
    color: theme.palette.common.white,
  },
  1: {
    backgroundColor: pink[500],
    color: theme.palette.common.white,
  },
  2: {
    backgroundColor: purple[500],
    color: theme.palette.common.white,
  },
  3: {
    backgroundColor: blue[500],
    color: theme.palette.common.white,
  },
  4: {
    backgroundColor: green[500],
    color: theme.palette.common.white,
  },
  5: {
    backgroundColor: yellow[500],
    color: theme.palette.common.black,
  },
  6: {
    backgroundColor: orange[500],
    color: theme.palette.common.black,
  },
  7: {
    backgroundColor: brown[500],
    color: theme.palette.common.white,
  },
  8: {
    backgroundColor: grey[50],
    color: theme.palette.common.black,
  },
  9: {
    backgroundColor: grey[900],
    color: theme.palette.common.white,
  },
});

class PlayerList extends Component {
  constructor(props) {
    super(props);
    this.state = {locked: true};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      60 * 1000
    );
    this.tick();
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      locked: new Date(this.props.players[0].tee_time) < new Date()
    });
  }

  render() {
    const { classes, players, groupIndex, selectPlayer } = this.props
    return (
      <div className={classes.root}>
        <Paper>
          <List component="nav">
            <ListItem className={this.props.classes[groupIndex]}>
              <ListItemText primary={
                <React.Fragment>
                  <Typography className={this.props.classes[groupIndex]}>
                    {`Group ${groupIndex+1} ${this.state.locked ? ' (LOCKED)' : ''}`}
                  </Typography>
                </React.Fragment>
              } />
            </ListItem>
            {players.map(player => (
              <Player key={player.id} {...player} locked={false} onClick={() => selectPlayer(player.id, groupIndex)} />
            ))}
          </List>
        </Paper>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectPlayer: (id, groupIndex) => (
          dispatch(selectPlayer(id, groupIndex)),
          dispatch(groupsCanSave(true))
        )
    };
};
export default connect(null, mapDispatchToProps)(withStyles(styles)(PlayerList));
