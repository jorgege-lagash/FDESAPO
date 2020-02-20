import { GenericEntitySuccessAction } from 'src/actions/action-utils';
import { Action } from 'src/types/Action';
import { BaseResourceState } from 'src/types/BaseResourceState';
import { intitializeBaseResource } from 'src/utils';
import { types as authActionTypes } from '../actions/auth.action';
import {
  cleanLocalStateAfterLogout,
  createDefaultBaseResourceResponseState,
  createDefaultErrorState,
  createDefaultRequestState,
} from './reducer-utils';

test('createDefaultBaseResourceResponseState', () => {
  const state: BaseResourceState<number> = intitializeBaseResource();
  state.isLoading = true;
  state.error = {};
  const action: Action = {
    type: 'test',
    payload: { ids: [1, 3, 3, 1, 1, 4] },
  };
  const resultState = createDefaultBaseResourceResponseState(
    state,
    action as GenericEntitySuccessAction
  );
  expect(resultState).toBeTruthy();
  expect(resultState.list).toEqual([1, 3, 4]);
  expect(resultState.isLoading).toBeFalsy();
  expect(resultState.error).toEqual(null);
});

test('createDefaultRequestState', () => {
  const state: BaseResourceState<number> = intitializeBaseResource();
  state.isLoading = false;
  state.error = {};
  const resultState = createDefaultRequestState(state);
  expect(resultState).toBeTruthy();
  expect(resultState.isLoading).toBeTruthy();
  expect(resultState.error).toEqual(null);
});

test('createDefaultErrorState', () => {
  const state: BaseResourceState<number> = intitializeBaseResource();
  state.isLoading = true;
  state.error = null;
  const error = {
    statusCode: 40,
    message: 'error :0!! ',
  };
  const action: Action = {
    type: 'test',
    payload: { error },
  };
  const resultState = createDefaultErrorState(state, action);
  expect(resultState).toBeTruthy();
  expect(resultState.isLoading).toBeFalsy();
  expect(resultState.error).toEqual(error);
});

describe('cleanLocalStateAfterLogout', () => {
  const initialState = {
    isAuthenticated: true,
  };
  const stateAfterLogout = {
    isAuthenticated: false,
  };
  test("cleanLocalStateAfterLogout clean's state after logout", () => {
    const action: Action = {
      type: authActionTypes.LOGOUT_SUCCESS,
    };
    const result = cleanLocalStateAfterLogout(
      initialState,
      action,
      stateAfterLogout
    );
    expect(result).toEqual(stateAfterLogout);
  });

  test('keep same state after if actions is no t logout', () => {
    const action: Action = {
      type: authActionTypes.LOGIN_FAILURE,
    };
    const result = cleanLocalStateAfterLogout(
      initialState,
      action,
      stateAfterLogout
    );
    expect(result).toEqual(initialState);
  });
});
