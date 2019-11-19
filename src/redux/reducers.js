import {combineReducers} from "redux";

import Bootcamps from "./bootcamps/reducer";
import Users from "./users/reducer";

export default combineReducers({
    Bootcamps,
    Users,
});