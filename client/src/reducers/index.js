import { combineReducers } from 'redux'
import { groups, groupsHasErrored, groupsIsLoading, groupsCanSave } from './groups';
import { leaderboard, leaderboardHasErrored, leaderboardIsLoading } from './leaderboard';
import { schedule, scheduleHasErrored, scheduleIsLoading } from './schedule';

export default combineReducers({
  groups,
  groupsHasErrored,
  groupsIsLoading,
  leaderboard,
  leaderboardHasErrored,
  leaderboardIsLoading,
  groupsCanSave,
  schedule, scheduleHasErrored, scheduleIsLoading
})
