import PropTypes from 'prop-types'
import Player from './Player'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { playersFetchData } from '../actions';
import { selectPlayer } from '../actions';




class PlayerList extends Component {
  componentDidMount() {
    this.props.fetchData(`${process.env.REACT_APP_API_URL}/api/groupings`);
  }
  render() {
    const { players, selectPlayer } = this.props
    if (this.props.hasErrored) {
      return <p>Sorry! There was an error loading the items</p>;
    }
    if (this.props.isLoading) {
      return <p>Loading…</p>;
    }
    return (
      <ul>
        {players.map(player => (
          <Player key={player.id} {...player} onClick={() => selectPlayer(player.id)} />
        ))}
      </ul>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        players: state.players,
        hasErrored: state.playersHasErrored,
        isLoading: state.playersIsLoading
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (url) => dispatch(playersFetchData(url)),
        selectPlayer: id => dispatch(selectPlayer(id))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(PlayerList);
