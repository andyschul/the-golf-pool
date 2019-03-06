export function auth(state = {}, action) {
    switch (action.type) {
        case 'SET_AUTH':
            return action.profile;
        default:
            return state;
    }
}
