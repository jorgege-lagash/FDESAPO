import { set } from 'lodash';
import { GenericEntitySuccessAction } from 'src/actions/action-utils';
import { types } from '../actions/permission.action';
import { Action } from '../types/Action';
import { BaseResourceState } from '../types/BaseResourceState';
import { MallPermission } from '../types/response/MallPermission';
import { intitializeBaseResource } from '../utils';
import {
  cleanLocalStateAfterLogout,
  createDefaultBaseResourceResponseState,
  createDefaultErrorState,
} from './reducer-utils';

export type PermissionState = BaseResourceState<number>;
const initialState: PermissionState = intitializeBaseResource();

export const permissionSelector = (state: any) => {
  const { permissions } = state;
  return (permissions as MallPermission[]).reduce((acc, curr) => {
    return set(acc, curr.name, true);
  }, {});
};

export default (state = initialState, action: Action): PermissionState => {
  switch (action.type) {
    case types.FETCH_MALL_PERMISSIONS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case types.FETCH_MALL_PERMISSIONS_SUCCESS:
      return createDefaultBaseResourceResponseState(
        state,
        action as GenericEntitySuccessAction
      );

    case types.FETCH_MALL_PERMISSIONS_FAILURE:
      return createDefaultErrorState(state, action);
    default:
      return cleanLocalStateAfterLogout<PermissionState>(state, action, {
        ...initialState,
      });
  }
};
