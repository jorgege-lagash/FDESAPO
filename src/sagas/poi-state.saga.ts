import { actions, types } from 'src/actions/poi-state.action';
import * as api from 'src/api';

import { takeEvery } from 'redux-saga/effects';
import { poiStateSchema } from 'src/schemas/poi-state.schema';
import { PoiState } from 'src/types/response/PoiState';
import { createEntityCrudSagas } from 'src/utils/saga.utils';

const sagas = createEntityCrudSagas<PoiState>(
  actions,
  api.poiState,
  poiStateSchema
);

export const poiStateSagas = [
  takeEvery(types.FETCH_LIST_REQUEST, sagas.fetchMallEntities),
  takeEvery(types.FETCH_REQUEST, sagas.fetchEntity),
];
