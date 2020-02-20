import { normalize } from 'normalizr';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

import { actions, types } from 'src/actions/terms-of-service.action';
import * as api from 'src/api';
import { termsOfServiceListSchema } from 'src/schemas/term-of-service.schema';
import {
  CreateTermsOfServiceRequestAction,
  TermsOfServiceListRequestAction,
  UpdateTermsOfServiceRequestAction,
} from 'src/types/action/TermsOfServiceActions';
import { TermsOfService } from 'src/types/response/TermsOfService';

export function* fetchMallTermsOfServices(
  action: TermsOfServiceListRequestAction
) {
  try {
    const { mallId } = action.payload;

    const fetchTermsOfServicesResponse: TermsOfService[] = yield call(
      api.termsOfService.fetch,
      mallId
    );

    const { entities, result: termsOfServiceIds } = normalize(
      fetchTermsOfServicesResponse,
      termsOfServiceListSchema
    );

    yield put(
      actions.fetchTermsOfServiceListSuccess(termsOfServiceIds, entities)
    );
  } catch (e) {
    yield put(actions.fetchTermsOfServiceListFailure(e));
  }
}

export function* createMallTermsOfService(
  action: CreateTermsOfServiceRequestAction
) {
  try {
    const { mallId, termsOfService } = action.payload;

    const response: TermsOfService = yield call(
      api.termsOfService.create,
      mallId,
      termsOfService
    );

    const { entities, result: termsOfServiceIds } = normalize(
      [response],
      termsOfServiceListSchema
    );

    yield put(actions.createTermsOfServiceSuccess(termsOfServiceIds, entities));
  } catch (e) {
    yield put(actions.createTermsOfServiceFailure(e));
  }
}

export function* updateMallTermsOfService(
  action: UpdateTermsOfServiceRequestAction
) {
  const { mallId, termsOfService } = action.payload;
  try {
    const response: TermsOfService = yield call(
      api.termsOfService.update,
      mallId,
      termsOfService.id,
      termsOfService
    );

    const { entities, result: termsOfServiceIds } = normalize(
      [response],
      termsOfServiceListSchema
    );

    yield put(actions.updateTermsOfServiceSuccess(termsOfServiceIds, entities));
  } catch (e) {
    if (e.statusCode === 404) {
      yield put(actions.createTermsOfService(mallId, termsOfService));
      return;
    }
    yield put(actions.updateTermsOfServiceFailure(e));
  }
}

export const termSagas = [
  takeLatest(types.FETCH_TERMS_LIST_REQUEST, fetchMallTermsOfServices),
  takeEvery(types.CREATE_TERMS_REQUEST, createMallTermsOfService),
  takeEvery(types.UPDATE_TERMS_REQUEST, updateMallTermsOfService),
];
