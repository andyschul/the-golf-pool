import { combineReducers } from 'redux'
import { groups, groupsHasErrored, groupsIsLoading, groupsCanSave } from './groups';
import { schedule, scheduleHasErrored, scheduleIsLoading } from './schedule';
import { auth } from './auth';

export default combineReducers({
  groups,
  groupsHasErrored,
  groupsIsLoading,
  groupsCanSave,
  schedule, scheduleHasErrored, scheduleIsLoading,
  auth
})
