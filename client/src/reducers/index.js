import { combineReducers } from 'redux'
import { players, playersHasErrored, playersIsLoading } from './players';
import todos from './todos'
import visibilityFilter from './visibilityFilter'

export default combineReducers({
  players, playersHasErrored, playersIsLoading,
  todos,
  visibilityFilter
})
