import { GenericEntitySuccessAction } from 'src/actions/action-utils';
import { types as authActionTypes } from '../actions/auth.action';
import { Action } from '../types/Action';
import { BaseResourceState } from '../types/BaseResourceState';
import { unique } from '../utils';

export const createDefaultBaseResourceResponseState = <
  T extends BaseResourceState<TId>,
  TId
>(
  state: T,
  action: Action
): T => {
  const { ids = [] } = action.payload;
  return {
    ...(state as any),
    saved: true,
    isLoading: false,
    error: null,
    list: unique([...state.list, ...ids]),
  };
};

export const createDefaultListResponseState = <
  T extends BaseResourceState<TId>,
  TId
>(
  state: T,
  action: GenericEntitySuccessAction
): T => {
  const { ids = [], total, page, pageSize } = action.payload;
  return {
    ...(state as any),
    isLoading: false,
    error: null,
    list: unique([...state.list, ...ids]),
    total,
    pages: {
      ...state.pages,
      [page]: ids,
    },
    page,
    perPage: pageSize,
  };
};

export const createDefaultRequestState = <T>(state: T): T => ({
  ...(state as any),
  saved: false,
  isLoading: true,
  error: null,
});

export const createDefaultErrorState = <T>(state: T, action: Action): T => {
  const { error } = action.payload;
  return {
    ...(state as any),
    saved: false,
    isLoading: false,
    error,
  };
};

export const cleanLocalStateAfterLogout = <T>(
  state: T,
  action: Action,
  stateAfterLogout: T
) => {
  if (action.type === authActionTypes.LOGOUT_SUCCESS) {
    return stateAfterLogout;
  }
  return state;
};
