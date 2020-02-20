import { normalize } from 'normalizr';
import { takeLatest } from 'redux-saga';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { actions, PwBuildingRequestAction } from 'src/actions/maas.action';
import { PwPoiListRequestAction, types } from 'src/actions/maas.action';
import * as api from 'src/api/maas.api';
import { pwBuildingListSchema, pwPoiListSchema } from 'src/schemas/maas.schema';
import { getMallById } from 'src/selectors/mall.selector';
import { Mall } from 'src/types/Mall';
import { PwPageData } from 'src/types/response/PaginatedData';
import { PwBuildingDTO } from 'src/types/response/PwBuilding';
import {
  createPwPoiFromPwPoiDTO,
  PwPoi,
  PwPoiDTO,
} from 'src/types/response/PwPoi';
import { processFloor } from 'src/utils/map.utils';

export function* fetchAllSucCodesFromMaaS(action: PwPoiListRequestAction) {
  try {
    const { mallId } = action.payload;
    const mall: Mall = yield select(getMallById, mallId);
    const limit = 600;
    let offset = 0;
    let result: PwPageData<PwPoiDTO> = yield call(
      api.maas.fetchPois,
      mall.buildingId,
      limit,
      offset
    );
    let poiList: PwPoi[] = result.data.map((p) => createPwPoiFromPwPoiDTO(p));
    if (result.pagination.results.total > limit) {
      for (let page = 2; page <= result.pagination.pages.total; page++) {
        offset = (page - 1) * limit;
        result = yield call(api.maas.fetchPois, mall.buildingId, limit, offset);
        poiList = [
          ...poiList,
          ...result.data.map((p) => createPwPoiFromPwPoiDTO(p)),
        ];
      }
    }

    const { entities, result: ids } = normalize(poiList, pwPoiListSchema);
    yield put(actions.fetchPwPoiListSuccess(ids, entities));
  } catch (error) {
    yield put(actions.fetchPwPoiListFailure(error));
  }
}

export function* fetchBuilding(action: PwBuildingRequestAction) {
  try {
    const { mallId } = action.payload;
    const response: PwBuildingDTO = yield call(api.maas.fetchBuilding, mallId);
    const floors = response.floors.map((f) => processFloor(f));
    response.floors = floors;
    const { entities, result: ids } = normalize(
      [response],
      pwBuildingListSchema
    );

    yield put(actions.fetchPwBuildingSuccess(ids, entities));
  } catch (error) {
    yield put(actions.fetchPwBuildingFailure(error));
  }
}

export const maasSagas = [
  takeLatest(types.FETCH_PWPOI_LIST_REQUEST, fetchAllSucCodesFromMaaS),
  takeEvery(types.FETCH_PW_BUILDING_REQUEST, fetchBuilding),
];
