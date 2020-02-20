import { actions, types } from 'src/actions/poi-type.action';
import * as api from 'src/api';

import { takeEvery } from 'redux-saga/effects';
import { poiTypeSchema } from 'src/schemas/poi-type.schema';
import { PoiType } from 'src/types/response/PoiType';
import { createEntityCrudSagas } from 'src/utils/saga.utils';

const sagas = createEntityCrudSagas<PoiType>(
  actions,
  api.poiType,
  poiTypeSchema
);

export const poiTypeSagas = [
  takeEvery(types.FETCH_LIST_REQUEST, sagas.fetchMallEntities),
  takeEvery(types.FETCH_REQUEST, sagas.fetchEntity),
  takeEvery(types.CREATE_REQUEST, sagas.createMallEntity),
  takeEvery(types.UPDATE_REQUEST, sagas.updateMallEntity),
];
