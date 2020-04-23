// jshint esversion: 9
import axios from 'axios';

import * as actionTypes from './actionTypes';

// I will essentially use this action to set a loading state and potentially show a spinner if I want to.
export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  }
}

export const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    userId: userId
  }
}

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  }
}

export const logout = () => {
  // because both is not needed anymore and shouldn't be stored any more, we aren't loged in anymore so the token will not be valid in the future. 
  // now let's fetch the token when we login, where can we check this? Well we should check it when the application loads, so for example in app.js this is the root component of our app and it's always loaded, no matter which route we visit so therefore this makes for a great app to check our authentication status. For checking this, we will need a new action creator 
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('userId');
  return {
    type: actionTypes.AUTH_LOGOUT
  }
}

// with that, we got this timer in place in our action creator's file in checkAuthTimeout which will fire after whatever firebase returns us and which will then ensure that the user is logged out. And for now, this will clear the store and not do much else, it won't show any visual feedback but we will implement something to happen when the user logs out including when he deliberately logs out to give the user a clue that he's not logged in anymore.
export const checkAuthTimeout = (expirationTime) => {
  // I will return this function where I get dispatch as an argument because I want to run some async code.
  return dispatch => {
    setTimeout(() => {
      // So here I would call dispatch after the expiration time to call the logout action, always execute these functions because that then returns the action (yukaridaki logout actioncreator dan bahsediyor) which is actually dispatched
      dispatch(logout());
      // I want to multiply this value with one thousand to turn my milliseconds to real seconds, so now it should be one hour.
    }, expirationTime * 1000);
  }
}

export const auth = (email, password, isSignup) => {
  return dispatch => {
    dispatch(authStart())
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    };
    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCfJAwZWGyJIt_3DeJJ27QilDOgB6nPgaQ';
    if (!isSignup) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCfJAwZWGyJIt_3DeJJ27QilDOgB6nPgaQ';
    }
    axios
      .post(url, authData)
      .then(response => {
        console.log(response);
        //  this gives us the expiration time but to turn this into a date object again, we have to wrap all of that with new date. So new date without arguments(ikincisi) gives us the current date, new date with arguments(birincisi) gives us a date with the date we passed as an argument, so here this will be the current date plus expiry time in seconds. So this is how that works,
        // now we can store expiration date in our local storage too whenever we acquire a token.
        const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000)
        // we can call setItem on it to store an item in the local storage, the item I want to store is my token let's say and that's just the key by which we can fetch it. The second argument to setItem is the actual item and this is response data ID token, 
        localStorage.setItem('token', response.data.idToken);
        // that's nice but the token alone won't be that useful if we fetch it in the future, we also need to know when it expires. So I'll store something else, setItem and I could store expiresIn but that's just the amount of seconds until it's invalid, that won't tell us much the next time we fetch this from local storage because the number of course won't update. So instead we should store the expiration date, so expiration date and the value should be the expiration date, now I'm going to calculate this and store it in a separate constant
        localStorage.setItem('expirationDate', expirationDate);
        localStorage.setItem('userId', response.data.localId)
        dispatch(authSuccess(response.data.idToken, response.data.localId));
        // I will dispatch this checkAuthTimeout action when we get back a success response
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch(err => {
        console.log(err);
        dispatch(authFail(err.response.data.error));
      })
  }
}

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path
  }
}

//with that, we can dispatch authCheckState to successfully automatically log the user in if we have a valid token.
export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = localStorage.getItem('expirationDate');
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const userId = localStorage.getItem('userId');
        dispatch(authSuccess(token, userId));
        // the difference of course is the expiry date, the expiry time in seconds I mean.
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/1000));
      }
    }
  }
}

