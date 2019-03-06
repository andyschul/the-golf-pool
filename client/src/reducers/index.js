import { combineReducers } from 'redux'
import { groups, groupsHasErrored, groupsIsLoading } from './groups';
import { schedule, scheduleHasErrored, scheduleIsLoading } from './schedule';
import { auth } from './auth';

export default combineReducers({
  groups,
  groupsHasErrored,
  groupsIsLoading,
  schedule, scheduleHasErrored, scheduleIsLoading,
  auth
})
