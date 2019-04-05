import { combineReducers } from 'redux'
import { profile, profileHasErrored, profileIsLoading } from './profile';
import { groups, groupsHasErrored, groupsIsLoading, groupsCanSave, groupVisibilityFilter } from './groups';
import { yearlyLeaderboard, leaderboard, leaderboardHasErrored, leaderboardIsLoading } from './leaderboard';
import { schedule, scheduleHasErrored, scheduleIsLoading } from './schedule';
import { reducer as formReducer } from 'redux-form'

export default combineReducers({
  profile, profileIsLoading, profileHasErrored,
  groups, groupsHasErrored, groupsIsLoading, groupsCanSave, groupVisibilityFilter,
  yearlyLeaderboard, leaderboard, leaderboardHasErrored, leaderboardIsLoading,
  schedule, scheduleHasErrored, scheduleIsLoading,
  form: formReducer
})
