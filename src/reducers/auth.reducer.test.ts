import { types } from '../actions/auth.action';
import reducer, { initialState, SessionState, UserInfo } from './auth.reducer';

describe('auth reducer', () => {
  const error = 'error';

  test('loads initial state when undefined is passed as parameter', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('returns same state if no valid action is provided', () => {
    const state: SessionState = {
      error: 'error',
      isAuthenticated: false,
      isLoading: true,
      userData: null,
      tokenData: null,
      currentUser: null,
    };
    expect(reducer(state, { type: '' })).toEqual(state);
  });

  test('LOGIN_REQUEST state', () => {
    const newState = reducer(undefined, {
      payload: undefined,
      type: types.LOGIN_REQUEST,
    });
    expect(newState.isLoading).toBeTruthy();
    expect(newState.error).toBeNull();
  });

  test('LOGIN_SUCCESS state', () => {
    const userData: UserInfo = {
      id: 'testId',
      userId: 1,
      iat: 1,
      exp: 1,
      malls: [],
      serverAuth: true,
      userType: 'a',
    };
    const newState = reducer(undefined, {
      payload: { userData, permissions: [] },
      type: types.LOGIN_SUCCESS,
    });
    expect(newState.isLoading).toBeFalsy();
    expect(newState.error).toBeNull();
    expect(newState.userData).toEqual(userData);
  });

  test('LOGIN_FAILURE state', () => {
    const newState = reducer(undefined, {
      payload: { error },
      type: types.LOGIN_FAILURE,
    });
    expect(newState.isAuthenticated).toBeFalsy();
    expect(newState.isLoading).toBeFalsy();
    expect(newState.error).toEqual(error);
    expect(newState.userData).toBeNull();
    expect(newState.tokenData).toBeNull();
  });

  test('LOGOUT_REQUEST state', () => {
    const newState = reducer(undefined, {
      payload: { user: null },
      type: types.LOGOUT_REQUEST,
    });
    expect(newState.isLoading).toBeTruthy();
    expect(newState.userData).toBeNull();
    expect(newState.tokenData).toBeNull();
  });
});
