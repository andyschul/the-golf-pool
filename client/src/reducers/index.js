import { combineReducers } from 'redux'
import { groups, groupsHasErrored, groupsIsLoading, groupsCanSave } from './groups';
import { yearlyLeaderboard, leaderboard, leaderboardHasErrored, leaderboardIsLoading } from './leaderboard';
import { schedule, scheduleHasErrored, scheduleIsLoading } from './schedule';

export default combineReducers({
  groups,
  groupsHasErrored,
  groupsIsLoading,
  yearlyLeaderboard,
  leaderboard,
  leaderboardHasErrored,
  leaderboardIsLoading,
  groupsCanSave,
  schedule, scheduleHasErrored, scheduleIsLoading
})
