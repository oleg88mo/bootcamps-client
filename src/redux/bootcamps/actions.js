import * as TYPES from "./types";

export function setBootcampsData(payload) {
    return async dispatch => await dispatch({type: TYPES.BOOTCAMPS_SET_DATA, payload})
}

export function getSingleBootcamp(payload) {
    return async dispatch => await dispatch({type: TYPES.BOOTCAMP_GET_SINGLE, payload})
}

export function setBootcampsReviewData(payload) {
    return async dispatch => await dispatch({type: TYPES.BOOTCAMPS_SET_REVIEWS_DATA, payload})
}

export function getCoursesForSingleBootcamp(payload) {
    return async dispatch => await dispatch({type: TYPES.GET_COURSES_FOR_SINGLE_BOOTCAMP, payload})
}

export function getReviewsForSingleBootcamp(payload) {
    return async dispatch => await dispatch({type: TYPES.GET_REVIEWS_FOR_SINGLE_BOOTCAMP, payload})
}


export function clearSingleBootcamp(payload) {
    return async dispatch => await dispatch({type: TYPES.CLEAR_SINGLE_BOOTCAMP, payload})
}

