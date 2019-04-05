import React from 'react'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const Player = ({ onClick, selected, tee_time, first_name, last_name, country, saved, locked }) => (
  <ListItem
    button
    disabled={locked}
    selected={selected}
    onClick={onClick}
  >
    <ListItemText secondary={`
      ${new Date(tee_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${first_name} ${last_name} (${country}) ${saved ? ' 🔒' : ''}
    `} />
  </ListItem>
)

export default Player
