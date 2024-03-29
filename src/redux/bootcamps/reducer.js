import * as TYPES from './types'

const INIT_STATE = {
    data: null,
    reviews: [],
    totalCount: null,
    pagination: {
        next: {
            limit: 10,
            page: 2
        }
    },
    singleBootcamp: [],
    filter: [],
    disabledSearchParam: false
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
                filter: [...newFilter.filter(criteria =>
                    Array.isArray(criteria.values) ? criteria.values.length : criteria.values,
                )],
            };
        }
        case TYPES.BOOTCAMPS_CLEAR_FILTER: {
            return {
                ...state,
                filter: [...state.filter.filter(el => el.name !== payload.name)],
            };
        }
        case TYPES.BOOTCAMPS_CLEAR_ALL_FILTER: {
            return {
                ...state,
                filter: [],
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
        case TYPES.BOOTCAMPS_DELETE_ELEMENT_FROM_FILTER: {
            return {
                ...state,
                filter: [...state.filter.filter(f => f.name !== payload)]
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
        case TYPES.BOOTCAMPS_SET_DISABLED_SEARCH_PARAM_FOR_LIST_COMPONENT: {
            return {
                ...state,
                disabledSearchParam: payload
            };
        }
        case TYPES.BOOTCAMPS_CHANGE_FILTER_OPTION: {
            const newFilter = [...state.filter.map(m => {
                    if (m.name === payload.prev) {
                        return payload.next
                    }

                    return m;
                }
            )];

            return {
                ...state,
                filter: newFilter
            };
        }
        default:
            return state
    }
}
