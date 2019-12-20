import * as TYPES from "./types";

export function setUser(payload) {
    return async dispatch => await dispatch({type: TYPES.USER_SET, payload})
}

export function getAllUsers(payload) {
    return async dispatch => await dispatch({type: TYPES.USER_ALL_GET, payload})
}

export function changeLang(payload) {
    return async dispatch => await dispatch({type: TYPES.CHANGE_LANG, payload})
}

export function changePageName(payload) {
    return async dispatch => await dispatch({type: TYPES.CHANGE_PAGE_NAME, payload})
}

export function setMyBootcamps(payload) {
    return async dispatch => await dispatch({type: TYPES.SET_MY_BOOTCAMPS, payload})
}

export function sortBootcamps(payload) {
    return async dispatch => await dispatch({type: TYPES.SORT_BOOTCAMPS, payload})
}

export function setMyCourses(payload) {
    return async dispatch => await dispatch({type: TYPES.SET_MY_COURSES, payload})
}

export function sortCourses(payload) {
    return async dispatch => await dispatch({type: TYPES.SORT_COURSES, payload})
}

export function updateUserInpormation(payload) {
    return async dispatch => await dispatch({type: TYPES.UPDATE_USER_INFORMATION, payload})
}
