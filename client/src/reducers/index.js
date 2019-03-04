import { combineReducers } from 'redux'
import { groups, groupsHasErrored, groupsIsLoading } from './groups';

export default combineReducers({
  groups,
  groupsHasErrored,
  groupsIsLoading
})
