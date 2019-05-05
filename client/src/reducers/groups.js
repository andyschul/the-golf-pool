export function groupsHasErrored(state = false, action) {
    switch (action.type) {
        case 'GROUPS_HAS_ERRORED':
            return action.hasErrored;
        default:
            return state;
    }
}

export function groupsIsLoading(state = false, action) {
    switch (action.type) {
        case 'GROUPS_IS_LOADING':
            return action.isLoading;
        default:
            return state;
    }
}

export function groups(state = {locked: true, picks: []}, action) {
    switch (action.type) {
        case 'GROUPS_FETCH_DATA_SUCCESS':
            return action.groups;
        case 'SELECT_PLAYER':
          return {
            ...state,
            picks: state.picks.map((group, idx) => idx !== action.groupIndex ? group : (group.map(player => player.id === action.id ? { ...player, selected: true } : { ...player, selected: false })))
          }
        case 'CANCEL_PICKS':
          return {
            ...state,
            picks: state.picks.map(group => group.map(player => ({ ...player, selected: false })))
          }
        default:
            return state;
    }
}

export function groupVisibilityFilter(state = 'SHOW_ALL', action) {
  switch (action.type) {
    case 'SET_GROUP_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

export function groupsCanSave(state = false, action) {
    switch (action.type) {
        case 'GROUPS_CAN_SAVE':
            return action.canSave;
        default:
            return state;
    }
}
