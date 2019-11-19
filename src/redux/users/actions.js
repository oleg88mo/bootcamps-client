import * as TYPES from "./types";

export function setUser(payload) {
    return async dispatch => await dispatch({type: TYPES.USER_SET, payload})
}

export function getAllUsers(payload) {
    return async dispatch => await dispatch({type: TYPES.USER_ALL_GET, payload})
}


