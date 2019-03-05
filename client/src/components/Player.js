import React from 'react'
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const Player = ({ onClick, selected, tee_time, first_name, last_name, country }) => (
  <ListItem
    button
    selected={selected}
    onClick={onClick}
  >
    <ListItemText primary={`
      ${new Date(tee_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${first_name} ${last_name} (${country})
    `} />
  </ListItem>
)

Player.propTypes = {
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  first_name: PropTypes.string.isRequired
}

export default Player
