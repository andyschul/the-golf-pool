export const selectPlayer = (id, groupIndex) => ({
  type: 'SELECT_PLAYER',
  id,
  groupIndex
})

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


export function scheduleHasErrored(bool) {
    return {
        type: 'SCHEDULE_HAS_ERRORED',
        hasErrored: bool
    };
}
export function scheduleIsLoading(bool) {
    return {
        type: 'SCHEDULE_IS_LOADING',
        isLoading: bool
    };
}
export function scheduleFetchDataSuccess(schedule) {
    return {
        type: 'SCHEDULE_FETCH_DATA_SUCCESS',
        schedule
    };
}

let data = [ { id: 'b79a87f9-e868-4e10-8c42-2f06d7630f2a',
  name: 'THE PLAYERS Championship',
  start_date: '2019-03-14' },
{ id: 'b404a8d5-5e33-4417-ae20-5d4d147042ee',
  name: 'Masters Tournament',
  start_date: '2019-04-11' },
{ id: 'b850e0a9-c15d-4263-8122-03df781e2b8d',
  name: 'PGA Championship',
  start_date: '2019-05-16' },
{ id: 'd59637dc-7f7a-4cd8-a4af-0c5d419a9f39',
  name: 'U.S. Open',
  start_date: '2019-06-13' },
{ id: '4524eac8-9713-43c5-a742-290d8ab434ba',
  name: 'The Open Championship',
  start_date: '2019-07-18' } ];

export function scheduleFetchData(url) {
    return (dispatch) => {
        dispatch(scheduleIsLoading(true));
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                dispatch(scheduleIsLoading(false));
                return response;
            })
            .then((response) => data)
            .then((schedule) => dispatch(scheduleFetchDataSuccess(schedule)))
            .catch(() => dispatch(scheduleHasErrored(true)));
    };
}

export const auth = (profile) => ({
  type: 'SET_AUTH',
  profile
})
