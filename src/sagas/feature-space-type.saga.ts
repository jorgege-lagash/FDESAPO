import { actions, types } from 'src/actions/feature-space-type.action';
import * as api from 'src/api';

import { takeEvery } from 'redux-saga/effects';
import { featureSpaceTypeSchema } from 'src/schemas/feature-space-type.schema';
import { FeatureSpaceType } from 'src/types/response/FeatureSpaceType';
import { createEntityCrudSagas } from 'src/utils/saga.utils';

const sagas = createEntityCrudSagas<FeatureSpaceType>(
  actions,
  api.featureSpaceTypes,
  featureSpaceTypeSchema
);

export const featureSpaceTypeSagas = [
  takeEvery(types.FETCH_LIST_REQUEST, sagas.fetchMallEntities),
  takeEvery(types.FETCH_REQUEST, sagas.fetchEntity),
  takeEvery(types.CREATE_REQUEST, sagas.createMallEntity),
  takeEvery(types.UPDATE_REQUEST, sagas.updateMallEntity),
];
