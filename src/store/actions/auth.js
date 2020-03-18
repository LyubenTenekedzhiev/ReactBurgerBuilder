import * as actionType from "./actionTypes";

import axios from "axios";

export const authStart = () => {
  return {
    type: actionType.AUTH_START
  };
};

export const authSuccess = (token, userId) => {
  return {
    type: actionType.AUTH_SUCCESS,
    idToken: token,
    userId: userId
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("userId");
  return {
    type: actionType.AUTH_LOGOUT
  };
};

export const checkAuthTimeout = expiredSession => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expiredSession * 1000);
  };
};

export const authFail = error => {
  return {
    type: actionType.AUTH_FAIL,
    error: error
  };
};

export const auth = (email, password, isSignUp) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    };

    let url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCGyBIHc1hDkY_Tnq_4MQfF771ZlTvzOxk";
    if (!isSignUp) {
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCGyBIHc1hDkY_Tnq_4MQfF771ZlTvzOxk";
    }

    axios
      .post(url, authData)
      .then(response => {
        const expirationDate = new Date().getTime() + response.data.expiresIn * 1000;
        localStorage.setItem("token", response.data.idToken);
        localStorage.setItem("expirationDate", expirationDate);
        localStorage.setItem("userId", response.data.localId);
        dispatch(authSuccess(response.data.idToken, response.data.localId));
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch(err => {
        dispatch(authFail(err.response.data.error));
      });
  };
};

export const setAuthRedirectPath = path => {
  return {
    type: actionType.SET_AUTH_REDIRECT_PATH,
    path: path
  };
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = (localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('userId');
        dispatch(authSuccess(token, userId));
        dispatch(checkAuthTimeout((expirationDate - new Date().getTime()) / 1000))
      }
    }
  };
};
