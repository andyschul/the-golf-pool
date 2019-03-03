import React from 'react'
import PropTypes from 'prop-types'
import Player from './Player'

const PlayerList = ({ players, togglePlayer }) => (
  <ul>
    {players.map(player => (
      <Player key={player.id} {...player} onClick={() => togglePlayer(player.id)} />
    ))}
  </ul>
)

PlayerList.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      selected: PropTypes.bool.isRequired,
      first_name: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  togglePlayer: PropTypes.func.isRequired
}

export default PlayerList
