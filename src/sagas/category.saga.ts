import { normalize } from 'normalizr';
import { call, put, takeEvery } from 'redux-saga/effects';

import { actions, types } from 'src/actions/category.action';
import * as api from 'src/api';
import {
  categoryListSchema,
  categorySchema,
} from 'src/schemas/category.schema';

import { Category } from 'src/types/response/Category';
import { EntityListRequestAction } from 'src/utils/basic-crud.action.types';
import { createEntityCrudSagas } from 'src/utils/saga.utils';

export function* fetchMallCategories(action: EntityListRequestAction) {
  try {
    const { mallId } = action.payload;
    const fetchCategorysResponse: Category[] = yield call(
      api.category.fetchAll,
      mallId
    );

    const { entities, result: categoryIds } = normalize(
      fetchCategorysResponse,
      categoryListSchema
    );

    yield put(actions.fetchCategoryListSuccess(categoryIds, entities));
  } catch (e) {
    yield put(actions.fetchCategoryListFailure(e));
  }
}

const sagas = createEntityCrudSagas(actions, api.category, categorySchema);

export const categorySagas = [
  takeEvery(types.FETCH_PAGED_LIST_REQUEST, sagas.fetchPagedMallEntities),
  takeEvery(types.FETCH_REQUEST, sagas.fetchEntity),
  takeEvery(types.CREATE_REQUEST, sagas.createMallEntity),
  takeEvery(types.UPDATE_REQUEST, sagas.updateMallEntity),
  takeEvery(types.DELETE_REQUEST, sagas.deleteEntity),
];
