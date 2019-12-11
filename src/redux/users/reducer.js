import * as TYPES from './types'

const INIT_STATE = {
    data: [],
    me: null,
    myBootcamps: null,
    sort: 'DESC',
    lang: 'ua',
    bootcampPage: '1'
};

export default function users(state = INIT_STATE, {type, payload}) {
    switch (type) {
        case TYPES.USER_SET: {
            const user = {
                email: payload.email,
                name: payload.name,
                role: payload.role,
                id: payload._id,
            };

            return {
                ...state,
                me: user
            };
        }
        case TYPES.USER_ALL_GET: {
            return {
                ...state,
                data: [...payload.data]
            };
        }
        case TYPES.CHANGE_PAGE_NAME: {
            return {
                ...state,
                bootcampPage: payload
            };
        }
        case TYPES.SET_MY_BOOTCAMPS: {
            return {
                ...state,
                myBootcamps: {
                    data: payload.data.sort((a, b) => {
                        const resA = a.name.toLowerCase();
                        const resB = b.name.toLowerCase();

                        return resA > resB ? 1 : resA === resB ? 0 : -1;
                    }),
                    totalCount: payload.totalCount,
                    pagination: payload.pagination
                }
            };
        }
        case TYPES.SORT_BOOTCAMPS: {
            const sortedData = [...state.myBootcamps.data.sort((a, b) => {
                let nameA = a.name.toUpperCase();
                let nameB = b.name.toUpperCase();

                if (nameA < nameB) {
                    return payload === 'DESC' ? -1 : 1;
                }
                if (nameA > nameB) {
                    return payload === 'DESC' ? 1 : -1;
                }

                return 0;
            })];

            return {
                ...state,
                myBootcamps: {
                    ...state.myBootcamps,
                    data: sortedData
                },
                sort: payload
            };
        }
        case TYPES.CHANGE_LANG: {
            return {
                ...state,
                lang: payload
            };
        }
        default:
            return state
    }
}
