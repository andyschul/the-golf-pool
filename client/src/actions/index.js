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

export const selectPlayer = (id, groupIndex) => ({
  type: 'SELECT_PLAYER',
  id,
  groupIndex
})

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

export function groupsHasErrored(bool) {
    return {
        type: 'GROUPS_HAS_ERRORED',
        hasErrored: bool
    };
}
export function groupsIsLoading(bool) {
    return {
        type: 'GROUPS_IS_LOADING',
        isLoading: bool
    };
}
export function groupsFetchDataSuccess(groups) {
    return {
        type: 'GROUPS_FETCH_DATA_SUCCESS',
        groups
    };
}

export function groupsFetchData(url) {
    return (dispatch) => {
        dispatch(groupsIsLoading(true));
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                dispatch(groupsIsLoading(false));
                return response;
            })
            .then((response) => response.json())
            .then((groups) => dispatch(groupsFetchDataSuccess(groups)))
            .catch(() => dispatch(groupsHasErrored(true)));
    };
}
