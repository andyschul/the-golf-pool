let nextTodoId = 0
export const addTodo = text => ({
  type: 'ADD_TODO',
  id: nextTodoId++,
  text
})

export const setVisibilityFilter = filter => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})

export const toggleTodo = id => ({
  type: 'TOGGLE_TODO',
  id
})

export const togglePlayer = id => ({
  type: 'TOGGLE_PLAYER',
  id
})

export const selectPlayer = id => ({
  type: 'SELECT_PLAYER',
  id
})

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

export function playersHasErrored(bool) {
    return {
        type: 'PLAYERS_HAS_ERRORED',
        hasErrored: bool
    };
}
export function playersIsLoading(bool) {
    return {
        type: 'PLAYERS_IS_LOADING',
        isLoading: bool
    };
}
export function playersFetchDataSuccess(players) {
    return {
        type: 'PLAYERS_FETCH_DATA_SUCCESS',
        players
    };
}

export function playersFetchData(url) {
    return (dispatch) => {
        dispatch(playersIsLoading(true));
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                dispatch(playersIsLoading(false));
                return response;
            })
            .then((response) => response.json())
            .then((players) => dispatch(playersFetchDataSuccess(players)))
            .catch(() => dispatch(playersHasErrored(true)));
    };
}
