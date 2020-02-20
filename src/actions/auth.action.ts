import { User } from 'src/types/response/User';
import { TokenInfo, UserInfo } from '../reducers/auth.reducer';
import { Action } from '../types/Action';

// src/ducks/auth.js
export const types = {
  AUTO_LOGIN: 'AUTH/AUTH_AUTO_LOGIN',
  LOGIN_FAILURE: 'AUTH/LOGIN_FAILURE',
  LOGIN_REQUEST: 'AUTH/LOGIN_REQUEST',
  LOGIN_SUCCESS: 'AUTH/LOGIN_SUCCESS',
  LOGOUT_REQUEST: 'AUTH/LOGOUT_REQUEST',
  LOGOUT_SUCCESS: 'AUTH/LOGOUT_SUCCESS',
  REFRESH_TOKEN_REQUEST: 'AUTH/REFRESH_TOKEN_REQUEST',
  REFRESH_TOKEN_REQUEST_FAILURE: 'AUTH/REFRESH_TOKEN_REQUEST_FAILURE',
  REFRESH_TOKEN_REQUEST_SUCCESS: 'AUTH/REFRESH_TOKEN_REQUEST_SUCCESS',
  SIGNUP_FAILURE: 'AUTH/SIGNUP_FAILURE',
  SIGNUP_REQUEST: 'AUTH/SIGNUP_REQUEST',
  SIGNUP_SUCCESS: 'AUTH/SIGNUP_SUCCESS',
  SET_USER: 'AUTH/SET_USER',
};

const autoLogin = (): Action => ({ type: types.AUTO_LOGIN });

const login = (email: string, password: string, remember: boolean): Action => ({
  payload: {
    email,
    password,
    remember,
  },
  type: types.LOGIN_REQUEST,
});

const loginSuccess = (userData: UserInfo, tokenData: TokenInfo): Action => ({
  payload: { userData, tokenData },
  type: types.LOGIN_SUCCESS,
});

const loginFailure = (error?: any): Action => ({
  payload: { error },
  type: types.LOGIN_FAILURE,
});

const logout = (): Action => ({ type: types.LOGOUT_REQUEST });

const logoutSuccess = (): Action => ({ type: types.LOGOUT_SUCCESS });

const signup = (email: string, password: string): Action => ({
  payload: {
    email,
    password,
  },
  type: types.SIGNUP_REQUEST,
});

const signupSuccess = (email: string): Action => ({
  payload: {
    email,
  },
  type: types.SIGNUP_SUCCESS,
});

const signupFailure = (error?: any): Action => ({
  payload: { error: error.message || error },
  type: types.SIGNUP_FAILURE,
});

const refreshToken = (): Action => ({ type: types.REFRESH_TOKEN_REQUEST });
const refreshTokenSuccess = (): Action => ({
  type: types.REFRESH_TOKEN_REQUEST_SUCCESS,
});
const refreshTokenFailure = (): Action => ({
  type: types.REFRESH_TOKEN_REQUEST_FAILURE,
});

const setUser = (user: User): Action => ({
  type: types.SET_USER,
  payload: {
    user,
  },
});

export const actions = {
  autoLogin,
  login,
  loginFailure,
  loginSuccess,
  logout,
  logoutSuccess,
  refreshToken,
  refreshTokenFailure,
  refreshTokenSuccess,
  signup,
  signupFailure,
  signupSuccess,
  setUser,
};
