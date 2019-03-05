import { combineReducers } from 'redux'
import { groups, groupsHasErrored, groupsIsLoading } from './groups';
import { schedule, scheduleHasErrored, scheduleIsLoading } from './schedule';

export default combineReducers({
  groups,
  groupsHasErrored,
  groupsIsLoading,
  schedule, scheduleHasErrored, scheduleIsLoading
})
