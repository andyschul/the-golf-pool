import auth0Client from '../Auth/Auth';
import axios from 'axios';

export const selectPlayer = (id, groupIndex) => ({
  type: 'SELECT_PLAYER',
  id,
  groupIndex
})

export const leaderboardExpandRow = (id) => ({
  type: 'LEADERBOARD_EXPAND_ROW',
  id
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
    return async (dispatch) => {
        dispatch(groupsIsLoading(true));
        let headers = {headers:{ 'Authorization': `Bearer ${auth0Client.getIdToken()}` }};
        try {
          const response = await axios.get(url, headers);
          dispatch(groupsFetchDataSuccess(response.data))
        } catch (error) {
          dispatch(groupsHasErrored(true));
        }
        dispatch(groupsIsLoading(false));
    };
}

export function leaderboardHasErrored(bool) {
    return {
        type: 'LEADERBOARD_HAS_ERRORED',
        hasErrored: bool
    };
}
export function leaderboardIsLoading(bool) {
    return {
        type: 'LEADERBOARD_IS_LOADING',
        isLoading: bool
    };
}

export function leaderboardFetchDataSuccess(leaderboard) {
    return {
        type: 'LEADERBOARD_FETCH_DATA_SUCCESS',
        leaderboard
    };
}

export function leaderboardFetchData(url) {
    return async (dispatch) => {
        dispatch(leaderboardIsLoading(true));
        let headers = {headers:{ 'Authorization': `Bearer ${auth0Client.getIdToken()}` }};
        try {
          const response = await axios.get(url, headers);
          dispatch(leaderboardFetchDataSuccess(response.leaderboard));
        } catch (error) {
          dispatch(leaderboardHasErrored(true));
        }
        dispatch(leaderboardIsLoading(false));
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
            .then((response) => response.json())
            .then((schedule) => dispatch(scheduleFetchDataSuccess(schedule)))
            .catch(() => dispatch(scheduleHasErrored(true)));
    };
}
