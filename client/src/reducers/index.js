import { combineReducers } from 'redux'
import { groups, groupsHasErrored, groupsIsLoading } from './groups';
import todos from './todos'
import visibilityFilter from './visibilityFilter'

export default combineReducers({
  groups, groupsHasErrored, groupsIsLoading,
  todos,
  visibilityFilter
})
