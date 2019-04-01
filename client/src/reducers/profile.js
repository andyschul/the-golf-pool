export function profileHasErrored(state = false, action) {
    switch (action.type) {
        case 'PROFILE_HAS_ERRORED':
            return action.hasErrored;
        default:
            return state;
    }
}

export function profileIsLoading(state = false, action) {
    switch (action.type) {
        case 'PROFILE_IS_LOADING':
            return action.isLoading;
        default:
            return state;
    }
}

export function profile(state = {}, action) {
    switch (action.type) {
        case 'PROFILE_FETCH_DATA_SUCCESS':
            return action.profile;
        default:
            return state;
    }
}
