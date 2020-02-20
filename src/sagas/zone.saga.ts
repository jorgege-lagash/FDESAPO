import { normalize } from 'normalizr';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

import { actions, types } from 'src/actions/zone.action';
import * as api from 'src/api';
import { zoneListSchema } from 'src/schemas/zone.schema';
import {
  CreateZoneRequestAction,
  UpdateZoneRequestAction,
  ZoneListRequestAction,
  ZoneRequestAction,
} from 'src/types/action/ZoneActions';
import { Zone } from 'src/types/response/Zone';

export function* fetchMallZones(action: ZoneListRequestAction) {
  try {
    const { mallId } = action.payload;

    const fetchZonesResponse: Zone[] = yield call(api.zone.fetch, mallId);

    const { entities, result: zoneIds } = normalize(
      fetchZonesResponse,
      zoneListSchema
    );

    yield put(actions.fetchZoneListSuccess(zoneIds, entities));
  } catch (e) {
    yield put(actions.fetchZoneListFailure(e));
  }
}

export function* fetchZone(action: ZoneRequestAction) {
  try {
    const { mallId, zoneId } = action.payload;

    const response: Zone = yield call(api.zone.fetchById, mallId, zoneId);

    const { entities, result: zoneIds } = normalize([response], zoneListSchema);

    yield put(actions.fetchZoneSuccess(zoneIds, entities));
  } catch (e) {
    yield put(actions.fetchZoneFailure(e));
  }
}

export function* createMallZone(action: CreateZoneRequestAction) {
  try {
    const { mallId, zone } = action.payload;

    const response: Zone = yield call(api.zone.create, mallId, zone);

    const { entities, result: zoneIds } = normalize([response], zoneListSchema);

    yield put(actions.createZoneSuccess(zoneIds, entities));
  } catch (e) {
    yield put(actions.createZoneFailure(e));
  }
}

export function* updateMallZone(action: UpdateZoneRequestAction) {
  const { mallId, zoneId, zone } = action.payload;
  try {
    const response: Zone = yield call(api.zone.update, mallId, zoneId, zone);

    const { entities, result: zoneIds } = normalize([response], zoneListSchema);

    yield put(actions.updateZoneSuccess(zoneIds, entities));
  } catch (e) {
    if (e.statusCode === 404) {
      yield put(actions.createZone(mallId, zone as Zone));
      return;
    }
    yield put(actions.updateZoneFailure(e));
  }
}

export const zoneSagas = [
  takeLatest(types.FETCH_ZONE_REQUEST, fetchZone),
  takeLatest(types.FETCH_ZONE_LIST_REQUEST, fetchMallZones),
  takeEvery(types.CREATE_ZONE_REQUEST, createMallZone),
  takeEvery(types.UPDATE_ZONE_REQUEST, updateMallZone),
];
