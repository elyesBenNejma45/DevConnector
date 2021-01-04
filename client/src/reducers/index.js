import {combineReducers} from "redux";
import alert from './alert';
import auth from './auth';
import profile from './profile';


export default combineReducers({
    alert,auth,profile
});

// just take an object that will have any reducer we create