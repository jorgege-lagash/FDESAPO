import { call, put, takeEvery } from 'redux-saga/effects';
import { actions, types } from 'src/actions/time-zones.action';
import * as api from 'src/api';
import { Action } from '../types/Action';

export function* fetchTimeZones(action: Action) {
  const { mallId } = action.payload;
  try {
    const fetchMallResponse = yield call(api.timeZones.fetchAll, mallId);
    const list = fetchMallResponse.data;
    const total = fetchMallResponse.data.length;
    yield put(actions.fetchTimeZonesListSuccess(list, total));
  } catch (e) {
    yield put(actions.fetchTimeZonesListFailure(e));
  }
}

export const timeZoneSagas = [
  takeEvery(types.FETCH_LIST_REQUEST, fetchTimeZones),
];
