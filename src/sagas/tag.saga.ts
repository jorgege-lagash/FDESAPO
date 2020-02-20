import { normalize } from 'normalizr';
import { call, put, takeEvery } from 'redux-saga/effects';
import { actions, types } from 'src/actions/tag.action';
import * as api from 'src/api';
import { tagListSchema, tagSchema } from 'src/schemas/tag.schema';
import { Tag } from 'src/types/response/Tag';
import { CreateEntityAction } from 'src/utils/basic-crud.action.types';
import { createEntityCrudSagas } from 'src/utils/saga.utils';
const sagas = createEntityCrudSagas<Tag>(actions, api.tag, tagSchema);

function* createTag(action: CreateEntityAction<Tag>) {
  try {
    const { mallId, data } = action.payload;
    const response: Tag = yield call(api.tag.findOrCreateTag, mallId, data);
    const id = response.id;
    const { entities, result: ids } = normalize([response], tagListSchema);
    yield put(actions.createEntitySuccess(ids, entities));
    yield put(actions.fetchEntity(mallId, id));
  } catch (e) {
    yield put(actions.createEntityFailure(e));
  }
}

export const tagSagas = [
  takeEvery(
    types.FETCH_ALL_PAGED_LIST_REQUEST,
    sagas.fetchAllPagedMallEntities
  ),
  takeEvery(types.FETCH_PAGED_LIST_REQUEST, sagas.fetchPagedMallEntities),
  takeEvery(types.FETCH_REQUEST, sagas.fetchEntity),
  takeEvery(types.CREATE_REQUEST, createTag),
  takeEvery(types.UPDATE_REQUEST, sagas.updateMallEntity),
  takeEvery(types.DELETE_REQUEST, sagas.deleteEntity),
];
