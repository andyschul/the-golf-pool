export function leaderboardHasErrored(state = false, action) {
    switch (action.type) {
        case 'LEADERBOARD_HAS_ERRORED':
            return action.hasErrored;
        default:
            return state;
    }
}

export function leaderboardIsLoading(state = false, action) {
    switch (action.type) {
        case 'LEADERBOARD_IS_LOADING':
            return action.isLoading;
        default:
            return state;
    }
}

export function leaderboardVisibilityFilter(state = 'SHOW_ALL', action) {
  switch (action.type) {
    case 'SET_LEADERBOARD_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

export function leaderboard(state = {view: 'group', tournamentStatus: '', leaderboard: [], tournamentLeaderboard: []}, action) {
    switch (action.type) {
        case 'LEADERBOARD_FETCH_DATA_SUCCESS':
            return action.leaderboard;
        case 'LEADERBOARD_EXPAND_ROW':
            return {
              ...state,
              leaderboard: state.leaderboard.map(item =>
                item.id === action.id ? { ...item, expanded: !item.expanded } : item
              )
            }
        case 'LEADERBOARD_VIEW':
            return {
              ...state,
              view: action.id
            }
        case 'TOURNAMENT_LEADERBOARD_EXPAND_ROW':
            return {
              ...state,
              tournamentLeaderboard: state.tournamentLeaderboard.map(item =>
                item.id === action.id ? { ...item, expanded: !item.expanded } : item
              )
            }
        default:
            return state;
    }
}

export function yearlyLeaderboard(state = [], action) {
    switch (action.type) {
        case 'YEARLY_LEADERBOARD_FETCH_DATA_SUCCESS':
            return action.yearlyLeaderboard;
        case 'YEARLY_LEADERBOARD_EXPAND_ROW':
            return state.map(item =>
              item.id === action.id ? { ...item, expanded: !item.expanded } : item
            )
        default:
            return state;
    }
}
