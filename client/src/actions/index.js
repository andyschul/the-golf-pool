export const selectPlayer = (id, groupIndex) => ({
  type: 'SELECT_PLAYER',
  id,
  groupIndex
})

export const leaderboardView = (id) => ({
  type: 'LEADERBOARD_VIEW',
  id
})

export const leaderboardExpandRow = (id) => ({
  type: 'LEADERBOARD_EXPAND_ROW',
  id
})

export const tournamentLeaderboardExpandRow = (id) => ({
  type: 'TOURNAMENT_LEADERBOARD_EXPAND_ROW',
  id
})

export const yearlyLeaderboardExpandRow = (id) => ({
  type: 'YEARLY_LEADERBOARD_EXPAND_ROW',
  id
})

export function profileFetchDataSuccess(profile) {
    return {
        type: 'PROFILE_FETCH_DATA_SUCCESS',
        profile
    };
}

export function setGroupVisibilityFilter(filter) {
    return {
        type: 'SET_GROUP_VISIBILITY_FILTER',
        filter
    };
}

export function setLeaderboardVisibilityFilter(filter) {
    return {
        type: 'SET_LEADERBOARD_VISIBILITY_FILTER',
        filter
    };
}

export function groupsCanSave(bool) {
    return {
        type: 'GROUPS_CAN_SAVE',
        canSave: bool
    };
}

export function groupsFetchDataSuccess(groups) {
    return {
        type: 'GROUPS_FETCH_DATA_SUCCESS',
        groups
    };
}

export const cancelPicks = () => ({
  type: 'CANCEL_PICKS'
})

export function leaderboardFetchDataSuccess(leaderboard) {
    return {
        type: 'LEADERBOARD_FETCH_DATA_SUCCESS',
        leaderboard
    };
}

export function yearlyLeaderboardFetchDataSuccess(yearlyLeaderboard) {
    return {
        type: 'YEARLY_LEADERBOARD_FETCH_DATA_SUCCESS',
        yearlyLeaderboard
    };
}

export function scheduleFetchDataSuccess(schedule) {
    return {
        type: 'SCHEDULE_FETCH_DATA_SUCCESS',
        schedule
    };
}
