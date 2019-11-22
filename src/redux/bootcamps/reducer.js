import * as TYPES from './types'

const INIT_STATE = {
    data: null,
    reviews: [],
    totalCount: null,
    pagination: null,
    singleBootcamp: [],
    filter: []
};

export default function bootcamps(state = INIT_STATE, {type, payload}) {
    switch (type) {
        case TYPES.BOOTCAMPS_SET_DATA: {
            return {
                ...state,
                data: [...payload.data],
                totalCount: payload.totalCount,
                pagination: payload.pagination
            };
        }
        case TYPES.BOOTCAMPS_SET_FILTER: {
            const isIncludes = state.filter.find(el => el.name === payload.name);
            const newFilter = isIncludes ? state.filter.map(el => el.name === payload.name ? payload : el) : [...state.filter, payload];

            return {
                ...state,
                filter: [
                    ...newFilter.filter(criteria =>
                        Array.isArray(criteria.values)
                            ? criteria.values.length
                            : criteria.values,
                    ),
                ],
            };
        }
        case TYPES.BOOTCAMPS_CLEAR_FILTER: {
            return {
                ...state,
                filter: [
                    ...state.filter.filter(el => el.name !== payload.name),
                ],
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
