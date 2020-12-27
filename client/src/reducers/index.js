import {combineReducers} from "redux";
import alert from './alert';
import auth from './auth';


export default combineReducers({
    alert,auth
});

// just take an object that will have any reducer we create