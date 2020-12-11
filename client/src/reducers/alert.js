
import {SET_ALERT ,REMOVE_ALERT} from '../actions/types';
const initialSate =[];

// return a state 
//action will have a type and a payload 
export default function manageAlert(state = initialSate ,action) {
    const {type,payload} = action;
    switch(type){
        case SET_ALERT:
            return [...state, payload];
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload);
        default: return state; 
        }
} 