import axios from 'axios';
import {setAlert} from './alert';

import {
    GET_PROFILE,PROFILE_ERROR,UPDATE_PROFILE,CLEAR_PROFILE,ACCOUNT_DELETED,GET_PROFILES,GET_REPOS
} from './types';

// get current profile
export const getCurrentProfile = () => async dispatch => {
    dispatch({
        type:CLEAR_PROFILE
    })
    try {
        const res =  await axios.get("/api/profile/me");
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        })
        } catch (error) {
            dispatch({
            type:PROFILE_ERROR,
            payload: {msg:error.response.statusText,status:error.response.status}    
        })
    }
}

// get All profiles
export const getProfiles = () => async dispatch => {
    try {
        const res =  await axios.get("/api/profile");
        dispatch({
            type:GET_PROFILES,
            payload:res.data
        })
        } catch (error) {
            dispatch({
            type:PROFILE_ERROR,
            payload: {msg:error.response.statusText,status:error.response.status}    
        })
    }
}


// get profile by Id
export const getProfileById = userId => async dispatch => {
    try {
        const res =  await axios.get(`/api/profile/user/${userId}`);
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        })
        } catch (error) {
            dispatch({
            type:PROFILE_ERROR,
            payload: {msg:error.response.statusText,status:error.response.status}    
        })
    }
}

// get gitHub
export const getGithubRepos = username => async dispatch => {
    try {
        const res =  await axios.get(`/api/profile/github/${username}`);
        dispatch({
            type:GET_REPOS,
            payload:res.data
        })
        } catch (error) {
            dispatch({
            type:PROFILE_ERROR,
            payload: {msg:error.response.statusText,status:error.response.status}    
        })
    }
}


//create or update profil
export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type':'application/json'
            }
        }

        const res = await axios.post('/api/profile',formData,config);
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        })
        dispatch(
            setAlert(edit?'profile updated':'profile created','success')
        );

        if(!edit){
            history.push('/dashboard');
        }
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type:PROFILE_ERROR,
            payload: {msg:err.response.statusText,status:err.response.status}    
        });        
    }
}


// add Experience
export const addExperience = (formData,history) => async dispatch =>{
    try {
        const config = {
            headers: {
                'Content-Type':'application/json'
            }
        }

        const res = await axios.put('/api/profile/experience',formData,config);
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        })
        dispatch(
            setAlert('experience added','success')
        );

            history.push('/dashboard');
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type:PROFILE_ERROR,
            payload: {msg:err.response.statusText,status:err.response.status}    
        });        
    }    
}

// add Experience
export const addEducation = (formData,history) => async dispatch =>{
    try {
        const config = {
            headers: {
                'Content-Type':'application/json'
            }
        }

        const res = await axios.put('/api/profile/education',formData,config);
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        })
        dispatch(
            setAlert('education added','success')
        );

            history.push('/dashboard');
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type:PROFILE_ERROR,
            payload: {msg:err.response.statusText,status:err.response.status}    
        });        
    }    
}

//Delete Experience
export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`);
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        })
        dispatch(
            setAlert('Experience Removed','success')
        );
    } catch (error) {
        dispatch({
            type:PROFILE_ERROR,
            payload: {msg:error.response.statusText,status:error.response.status}    
        });           
    }
}

//Delete Education
export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/education/${id}`);
        dispatch({
            type:UPDATE_PROFILE,
            payload:res.data
        })
        dispatch(
            setAlert('Education Removed','success')
        );
    } catch (error) {
        dispatch({
            type:PROFILE_ERROR,
            payload: {msg:error.response.statusText,status:error.response.status}    
        });           
    }
}

//Delete Account and Profile
//Delete Account
export const deleteAccount = () => async dispatch => {
    if(window.confirm('are you sure ? this can not be undone')){
        try {
            const res = await axios.delete('/api/profile');
            dispatch({
                type:CLEAR_PROFILE,
            })
            dispatch({
                type:ACCOUNT_DELETED,
            });
            dispatch(
                setAlert('your account is permanantly deleted')
            );            
        } catch (error) {
            dispatch({
                type:PROFILE_ERROR,
                payload: {msg:error.response.statusText,status:error.response.status}    
            });           
        }
    }
}