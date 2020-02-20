import { normalize } from 'normalizr';
import { call, put } from 'redux-saga/effects';
import { actions } from '../actions/permission.action';
import * as api from '../api';
import { permissionListSchema } from '../schemas/permissions.schema';
import { MallPermissionRequestAction } from '../types/action/MallPermissionRequestAction';
import { MallPermission } from '../types/response/MallPermission';

export function* fetchMallPermissions(action: MallPermissionRequestAction) {
  try {
    const { userId, mallId } = action.payload;
    const mallPermissionResponse: MallPermission = yield call(
      api.getUserPermissionsInMall,
      userId,
      mallId
    );
    const { entities, result: ids } = normalize(
      mallPermissionResponse,
      permissionListSchema
    );
    yield put(actions.fetchMallPermissionsSuccess(mallId, ids, entities));
  } catch (error) {
    yield put(actions.fetchMallPermissionsFailure(error));
  }
}
