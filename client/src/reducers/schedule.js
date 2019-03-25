export function scheduleHasErrored(state = false, action) {
    switch (action.type) {
        case 'SCHEDULE_HAS_ERRORED':
            return action.hasErrored;
        default:
            return state;
    }
}

export function scheduleIsLoading(state = false, action) {
    switch (action.type) {
        case 'SCHEDULE_IS_LOADING':
            return action.isLoading;
        default:
            return state;
    }
}

export function schedule(state = {currentTournament: {}, tournaments: []}, action) {
    switch (action.type) {
        case 'SCHEDULE_FETCH_DATA_SUCCESS':
            return action.schedule;
        default:
            return state;
    }
}
