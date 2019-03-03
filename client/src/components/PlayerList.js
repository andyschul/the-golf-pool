import PropTypes from 'prop-types'
import Player from './Player'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectPlayer } from '../actions';


class PlayerList extends Component {
  render() {
    const { players, groupIndex, selectPlayer } = this.props
    if (this.props.hasErrored) {
      return <p>Sorry! There was an error loading the items</p>;
    }
    if (this.props.isLoading) {
      return <p>Loading…</p>;
    }
    return (
      <ul>
        {players.map(player => (
          <Player key={player.id} {...player} onClick={() => selectPlayer(player.id, groupIndex)} />
        ))}
      </ul>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectPlayer: (id, groupIndex) => dispatch(selectPlayer(id, groupIndex))
    };
};
export default connect(null, mapDispatchToProps)(PlayerList);
