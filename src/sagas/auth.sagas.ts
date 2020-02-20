import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { User } from 'src/types/response/User';
import { actions, types } from '../actions/auth.action';
import { actions as permissionActions } from '../actions/permission.action';
import * as api from '../api';
import { UserInfo } from '../reducers/auth.reducer';
import { Action } from '../types/Action';
import { LoginResponse } from '../types/response/LoginResponse';

export function* login(action: Action) {
  try {
    const { email, password, remember } = action.payload;

    const authResponse: LoginResponse = yield call(api.login, email, password);
    const userInfo: UserInfo = JSON.parse(
      atob(authResponse.access_token.split('.')[1])
    );

    // Save token in Local Storage
    if (remember) {
      localStorage.setItem('sessionData', JSON.stringify(authResponse));
    }
    localStorage.setItem('access_token', authResponse.access_token);
    localStorage.setItem('refresh_token', authResponse.refresh_token);

    const { malls, ...tokenData } = authResponse;

    yield put(actions.loginSuccess(userInfo, tokenData));
    const user: User = yield call(api.fetchCurrentUser);
    yield put(actions.setUser(user));
    if (malls && malls.length > 0) {
      const defaultMall = malls[0];
      yield put(
        permissionActions.fetchMallPermissions(userInfo.userId, defaultMall.id)
      );
    }
  } catch (err) {
    const error = err.message || err;
    yield put(actions.loginFailure(error));
  }
}

export function* restoreSession() {
  try {
    // Check if token is in Local Storage to keep the user logged in after refreshing the page
    const sessionData = JSON.parse(localStorage.getItem(
      'sessionData'
    ) as string);

    if (sessionData) {
      const { malls, ...tokenData } = sessionData;
      const userData: UserInfo = JSON.parse(
        atob(sessionData.access_token.split('.')[1])
      );
      yield put(actions.loginSuccess(userData, tokenData));
      const user: User = yield call(api.fetchCurrentUser);
      yield put(actions.setUser(user));
      if (malls && malls.length > 0) {
        const defaultMall = malls[0];
        yield put(
          permissionActions.fetchMallPermissions(
            userData.userId,
            defaultMall.id
          )
        );
      }
    }
  } catch (err) {
    const error = err.message || err;
    yield put(actions.loginFailure(error));
  }
}

export function* logout() {
  let clearToken = true;
  try {
    yield call(api.logout);
  } catch (e) {
    if (e.statusCode !== 401) {
      clearToken = false;
    }
  } finally {
    if (clearToken) {
      localStorage.clear();
      yield put(actions.logoutSuccess());
    }
  }
}

export const authSagas = [
  takeEvery(types.LOGIN_REQUEST, login),
  takeEvery(types.LOGOUT_REQUEST, logout),
  takeLatest(types.AUTO_LOGIN, restoreSession),
];
