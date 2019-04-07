import auth0Client from '../Auth/Auth';
import axios from 'axios';

export const selectPlayer = (id, groupIndex) => ({
  type: 'SELECT_PLAYER',
  id,
  groupIndex
})

export const leaderboardView = (id) => ({
  type: 'LEADERBOARD_VIEW',
  id
})

export const leaderboardExpandRow = (id) => ({
  type: 'LEADERBOARD_EXPAND_ROW',
  id
})

export const tournamentLeaderboardExpandRow = (id) => ({
  type: 'TOURNAMENT_LEADERBOARD_EXPAND_ROW',
  id
})

export const yearlyLeaderboardExpandRow = (id) => ({
  type: 'YEARLY_LEADERBOARD_EXPAND_ROW',
  id
})


export function profileHasErrored(bool) {
    return {
        type: 'PROFILE_HAS_ERRORED',
        hasErrored: bool
    };
}
export function profileIsLoading(bool) {
    return {
        type: 'PROFILE_IS_LOADING',
        isLoading: bool
    };
}

export function profileFetchDataSuccess(profile) {
    return {
        type: 'PROFILE_FETCH_DATA_SUCCESS',
        profile
    };
}

export function changeProfile(field, value) {
    return {
        type: 'PROFILE_CHANGE',
        field,
        value
    };
}

export function fetchProfile(url) {
    return async (dispatch) => {
        dispatch(profileIsLoading(true));
        let headers = {headers:{ 'Authorization': `Bearer ${auth0Client.getIdToken()}` }};
        try {
          const response = await axios.get(url, headers);
          dispatch(profileFetchDataSuccess(response.data));
        } catch (error) {
          dispatch(profileHasErrored(true));
        }
        dispatch(profileIsLoading(false));
    };
}

export function saveProfile(data) {
    return async (dispatch) => {
        dispatch(profileIsLoading(true));
        try {
          const response = await axios({
            method: 'PUT',
            url: `${process.env.REACT_APP_API_URL}/api/profile`,
            headers:{ 'Authorization': `Bearer ${auth0Client.getIdToken()}` },
            data: data
          })
          dispatch(profileFetchDataSuccess(response.data));
          dispatch(profileIsLoading(false));
          return true;
        } catch (error) {
          dispatch(profileHasErrored(true));
          dispatch(profileIsLoading(false));
          return false;
        }
    };
}

export function setGroupVisibilityFilter(filter) {
    return {
        type: 'SET_GROUP_VISIBILITY_FILTER',
        filter
    };
}

export function setLeaderboardVisibilityFilter(filter) {
    return {
        type: 'SET_LEADERBOARD_VISIBILITY_FILTER',
        filter
    };
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

export function savePicks(url, data) {
    return async (dispatch) => {
        // dispatch(groupsSaveIsLoading(true));
        try {
          const response = await axios({
            method: 'PUT',
            url: url,
            headers:{ 'Authorization': `Bearer ${auth0Client.getIdToken()}` },
            data: data
          })
          dispatch(groupsFetchDataSuccess(response.data))
          return true;
        } catch (error) {
          // dispatch(groupsSaveHasErrored(true));
          return false;
        }
        // dispatch(groupsSaveIsLoading(false));
    };
}

export const cancelPicks = () => ({
  type: 'CANCEL_PICKS'
})

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
          dispatch(leaderboardFetchDataSuccess(response.data));
        } catch (error) {
          dispatch(leaderboardHasErrored(true));
        }
        dispatch(leaderboardIsLoading(false));
    };
}

export function yearlyLeaderboardHasErrored(bool) {
    return {
        type: 'YEARLY_LEADERBOARD_HAS_ERRORED',
        hasErrored: bool
    };
}
export function yearlyLeaderboardIsLoading(bool) {
    return {
        type: 'YEARLY_LEADERBOARD_IS_LOADING',
        isLoading: bool
    };
}

export function yearlyLeaderboardFetchDataSuccess(yearlyLeaderboard) {
    return {
        type: 'YEARLY_LEADERBOARD_FETCH_DATA_SUCCESS',
        yearlyLeaderboard
    };
}

export function yearlyLeaderboardFetchData(url) {
    return async (dispatch) => {
        dispatch(yearlyLeaderboardIsLoading(true));
        let headers = {headers:{ 'Authorization': `Bearer ${auth0Client.getIdToken()}` }};
        try {
          const response = await axios.get(url, headers);
          dispatch(yearlyLeaderboardFetchDataSuccess(response.data));
        } catch (error) {
          dispatch(yearlyLeaderboardHasErrored(true));
        }
        dispatch(yearlyLeaderboardIsLoading(false));
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
