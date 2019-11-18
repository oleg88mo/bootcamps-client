import * as TYPES from './types'

const INIT_STATE = {
    data: [],
    reviews: [],
    count: null,
    pagination: null,
    singleBootcamp: [],
};

export default function bootcamps(state = INIT_STATE, {type, payload}) {
    switch (type) {
        case TYPES.BOOTCAMPS_SET_DATA: {
            return {
                ...state,
                data: [...payload.data],
                count: payload.count,
                pagination: payload.pagination
            };
        }
        case TYPES.BOOTCAMPS_SET_REVIEWS_DATA: {
            return {
                ...state,
                reviews: [...payload.data]
            };
        }
        case TYPES.BOOTCAMP_GET_SINGLE: {
            return {
                ...state,
                singleBootcamp: payload.data
            };
        }
        case TYPES.GET_COURSES_FOR_SINGLE_BOOTCAMP: {
            return {
                ...state,
                singleBootcamp: {
                    ...state.singleBootcamp,
                    courses: [...payload.data]
                }
            };
        }
        case TYPES.GET_REVIEWS_FOR_SINGLE_BOOTCAMP: {
            return {
                ...state,
                singleBootcamp: {
                    ...state.singleBootcamp,
                    reviews: [...payload.data]
                }
            };
        }
        case TYPES.CLEAR_SINGLE_BOOTCAMP: {
            return {
                ...state,
                singleBootcamp: []
            };
        }
        default:
            return state
    }
}
