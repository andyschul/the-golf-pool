import React from 'react'
import PropTypes from 'prop-types'

const Player = ({ onClick, selected, first_name }) => (
  <li
    onClick={onClick}
    style={{
      textDecoration: selected ? 'line-through' : 'none'
    }}
  >
    {first_name}
  </li>
)

Player.propTypes = {
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
}

export default Player
