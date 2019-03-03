
export function playersHasErrored(state = false, action) {
    switch (action.type) {
        case 'PLAYERS_HAS_ERRORED':
            return action.hasErrored;
        default:
            return state;
    }
}
export function playersIsLoading(state = false, action) {
    switch (action.type) {
        case 'PLAYERS_IS_LOADING':
            return action.isLoading;
        default:
            return state;
    }
}
export function players(state = [], action) {
    switch (action.type) {
        case 'PLAYERS_FETCH_DATA_SUCCESS':
            return action.players;
        case 'SELECT_PLAYER':
          return state.map(player =>
            player.id === action.id ? { ...player, selected: true } : { ...player, selected: false }
          )
        default:
            return state;
    }
}




// let initialState = [{
//     "id": "03bdd912-c363-4517-99b5-7a1ec757ebe5",
//     "first_name": "Ted",
//     "last_name": "Potter",
//     "country": "UNITED STATES"
// }, {
//     "id": "be6ec8b4-536a-4134-917d-9336b32cfdd8",
//     "first_name": "Wesley",
//     "last_name": "Bryan",
//     "country": "UNITED STATES"
// }, {
//     "id": "1f189584-ff86-42da-9743-40397cb9d5ff",
//     "first_name": "Austin",
//     "last_name": "Cook",
//     "country": "UNITED STATES"
// }]
//
// const players = (state = initialState, action) => {
//   switch (action.type) {
//     case 'TOGGLE_PLAYER':
//       return state.map(player =>
//         player.id === action.id ? { ...player, selected: true } : { ...player, selected: false }
//       )
//     default:
//       return state
//   }
// }
//
// export default players
