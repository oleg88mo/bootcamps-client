import * as TYPES from './types';
// utils
import {sortPayload, sortByClick} from '../../components/utils/usedFunctions';

const INIT_STATE = {
    data: [],
    me: null,
    myBootcamps: null,
    myCourses: null,
    sort: 'DESC',
    sortCourses: 'DESC',
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
                    data: payload.data && sortPayload(payload.data, 'name'),
                    totalCount: payload.totalCount,
                    pagination: payload.pagination
                }
            };
        }
        case TYPES.SORT_BOOTCAMPS: {
            const sortedData = state.myBootcamps && state.myBootcamps.data ? sortByClick(state.myBootcamps.data, 'name', payload) : [];

            return {
                ...state,
                myBootcamps: {
                    ...state.myBootcamps,
                    data: sortedData
                },
                sort: payload
            };
        }
        case TYPES.SET_MY_COURSES: {
            const tempArr = [];

            if (payload.data.length > 0) {
                payload.data.map(el => el.courses.length > 0 && el.courses.map(c => tempArr.push(c)))
            }

            return {
                ...state,
                myCourses: {
                    data: tempArr && sortPayload(tempArr, 'title'),
                    totalCount: payload.totalCount,
                    pagination: payload.pagination
                }
            };
        }
        case TYPES.SORT_COURSES: {
            const sortedData = state.myCourses && state.myCourses.data ? sortByClick(state.myCourses.data, 'title', payload) : [];

            return {
                ...state,
                myCourses: {
                    ...state.myCourses,
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
        case TYPES.UPDATE_USER_INFORMATION: {
            return {
                ...state,
                me: {
                    ...state.me,
                    email: payload.email,
                    name: payload.name
                }
            };
        }
        default:
            return state
    }
}
