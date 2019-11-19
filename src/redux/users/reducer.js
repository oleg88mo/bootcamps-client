import * as TYPES from './types'

const INIT_STATE = {
    data: [],
    me: null,
};

export default function users(state = INIT_STATE, {type, payload}) {
    switch (type) {
        case TYPES.USER_SET: {
            const user = {
                email: payload.email,
                name: payload.name,
                role: payload.role,
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
        default:
            return state
    }
}