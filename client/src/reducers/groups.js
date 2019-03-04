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

export function groups(state = [], action) {
    switch (action.type) {
        case 'GROUPS_FETCH_DATA_SUCCESS':
            return action.groups;
        case 'SELECT_PLAYER':
          return state.map((group, idx) => idx !== action.groupIndex ? group : (group.map(player => player.id === action.id ? { ...player, selected: true } : { ...player, selected: false })));
        default:
            return state;
    }
}
