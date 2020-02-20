import { Action } from '../types/Action';
import { MallPermissionRequestAction } from '../types/action/MallPermissionRequestAction';

export const types = {
  FETCH_MALL_PERMISSIONS_FAILURE: 'PERMISSION/FETCH_MALL_PERMISSIONS_FAILURE',
  FETCH_MALL_PERMISSIONS_REQUEST: 'PERMISSION/FETCH_MALL_PERMISSIONS_REQUEST',
  FETCH_MALL_PERMISSIONS_SUCCESS: 'PERMISSION/FETCH_MALL_PERMISSIONS_SUCCESS',
};

const fetchMallPermissions = (
  userId: number,
  mallId: number
): MallPermissionRequestAction => {
  return {
    type: types.FETCH_MALL_PERMISSIONS_REQUEST,
    payload: {
      userId,
      mallId,
    },
  };
};

const fetchMallPermissionsSuccess = (
  mallId: number,
  ids: number[],
  entities: any
): Action => {
  return {
    type: types.FETCH_MALL_PERMISSIONS_SUCCESS,
    payload: {
      mallId,
      ids,
      entities,
    },
  };
};
const fetchMallPermissionsFailure = (error: any): Action => {
  return {
    type: types.FETCH_MALL_PERMISSIONS_FAILURE,
    payload: {
      error,
    },
  };
};

export const actions = {
  fetchMallPermissions,
  fetchMallPermissionsSuccess,
  fetchMallPermissionsFailure,
};
