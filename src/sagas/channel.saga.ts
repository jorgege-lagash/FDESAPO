import { takeEvery } from 'redux-saga/effects';

import { actions, types } from 'src/actions/channel.action';
import * as api from 'src/api';
import { channelSchema } from 'src/schemas/channel.schema';

import { createEntityCrudSagas } from 'src/utils/saga.utils';

const sagas = createEntityCrudSagas(actions, api.channel, channelSchema);

export const channelSagas = [
  takeEvery(types.FETCH_PAGED_LIST_REQUEST, sagas.fetchPagedMallEntities),
  takeEvery(types.FETCH_REQUEST, sagas.fetchEntity),
  takeEvery(types.CREATE_REQUEST, sagas.createMallEntity),
  takeEvery(types.UPDATE_REQUEST, sagas.updateMallEntity),
  takeEvery(types.DELETE_REQUEST, sagas.deleteEntity),
];
