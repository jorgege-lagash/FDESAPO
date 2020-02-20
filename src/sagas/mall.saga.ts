import { normalize } from 'normalizr';
import { call, put, takeEvery } from 'redux-saga/effects';

import { TypedLooseObject } from 'src/types/LooseObject';
import { MallTranslationFormProps } from 'src/types/TranslationForm';
import { getTranslationValueObject } from 'src/utils';
import { CustomHeaders } from 'src/utils/request';
import { actions, FetchMallAction, types } from '../actions/mall.action';
import * as api from '../api';
import { mallListSchema, mallSchema } from '../schemas/malls.schema';
import { Action } from '../types/Action';
import {
  CreateMallRequestAction,
  UpdateMallRequestAction,
} from '../types/action/MallActions';
import { Mall } from '../types/Mall';

export function* fetchMall(action: FetchMallAction) {
  try {
    const { mallId, language } = action.payload;
    const customHeaders: CustomHeaders = {
      'accept-language': language,
    };
    const response: Mall = yield call(
      api.mall.fetchMall,
      mallId,
      customHeaders
    );

    const { entities, result: ids } = normalize([response], mallListSchema);

    yield put(
      actions.fetchMallSuccess(
        ids,
        entities,
        undefined,
        undefined,
        undefined,
        language
      )
    );
  } catch (e) {
    yield put(actions.fetchMallFailure(e));
  }
}

export function* createMall(action: CreateMallRequestAction) {
  try {
    const { userId, mall, translations } = action.payload;
    const response: Mall = yield call(api.mall.create, userId, mall);
    const { entities, result: mallIds } = normalize(response, mallSchema);
    yield call(translateLanguages, response.id, translations);
    yield put(actions.createMallSuccess(mallIds, entities));
  } catch (e) {
    yield put(actions.createMallFailure(e));
  }
}

export function* updateMall(action: UpdateMallRequestAction) {
  try {
    const { mallId, mall, translations } = action.payload;
    const response: Mall = yield call(api.mall.update, mallId, mall);
    const { entities, result: mallIds } = normalize(response, mallSchema);
    delete translateLanguages.arguments;
    yield call(translateLanguages, mallId, translations);
    yield put(actions.updateMallSuccess(mallIds, entities));
  } catch (e) {
    yield put(actions.updateMallFailure(e));
  }
}

export function* fetchMalls(action: Action) {
  try {
    const fetchMallResponse: Mall[] = yield call(api.mall.fetchAll);
    const { entities, result: mallIds } = normalize(
      fetchMallResponse,
      mallListSchema
    );
    yield put(actions.fetchMallListSuccess(mallIds, entities));
  } catch (e) {
    yield put(actions.fetchMallListFailure(e));
  }
}

function* translateLanguages(
  mallId: number,
  translation: TypedLooseObject<MallTranslationFormProps>
) {
  const languageKeys = Object.keys(translation);
  for (const lang of languageKeys) {
    yield call(translate, mallId, lang, translation[lang]);
  }
}

function* translate(
  mallId: number,
  language: string,
  translation: MallTranslationFormProps
) {
  try {
    const translationValues = getTranslationValueObject(translation as any);
    const data: Partial<Mall> = translationValues;
    if (data.name) {
      delete data.name;
    }
    const headers = { 'accept-language': language };
    yield call(api.mall.update, mallId, data, headers);
    yield put(actions.mallTranslateSuccess(mallId, language));
  } catch (error) {
    yield put(actions.mallTranslateFailure(mallId, language));
  }
}

export const mallSagas = [
  takeEvery(types.CREATE_MALL_REQUEST, createMall),
  takeEvery(types.FETCH_MALL_LIST_REQUEST, fetchMalls),
  takeEvery(types.UPDATE_MALL_REQUEST, updateMall),
  takeEvery(types.FETCH_MALL_REQUEST, fetchMall),
];
