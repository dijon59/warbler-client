import {apiCall, setTokenHeader} from "../../services/api";
import {SET_CURRENT_USER} from "../actionTypes";
import {addError, removeError} from "./errors";

export function setAuthorizationToken(token){
	setTokenHeader(token);
}

// action creators
export function setCurrentUser(user){
	return {
		type:SET_CURRENT_USER,
		user
	};
}

export function logout(){
	return dispatch=>{
		localStorage.clear();
		setAuthorizationToken(false)
		dispatch(setCurrentUser({}));
	}
}

export function authUser(type, userData) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      return apiCall('post', `/api/auth/${type}`, userData)
        .then(({ token, ...user }) => {
					// marked user as logged in 
          localStorage.setItem('jwtToken', token);
					setAuthorizationToken(token)
          dispatch(setCurrentUser(user));
					dispatch(removeError());
          resolve();
        })
				.catch(err=>{
					dispatch(addError(err.message));
					reject();
				});
    });
  };
}