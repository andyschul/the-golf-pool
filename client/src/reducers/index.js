import { combineReducers } from 'redux'
import players from './players'
import todos from './todos'
import visibilityFilter from './visibilityFilter'

export default combineReducers({
  players,
  todos,
  visibilityFilter
})
