import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { actions, types } from 'src/actions/deal.action';
import * as api from 'src/api';
import { dealListSchema, dealSchema } from 'src/schemas/deal.schema';

import { normalize } from 'normalizr';
import { ApplicationState } from 'src/reducers';
import { TypedLooseObject } from 'src/types/LooseObject';
import { ApiError } from 'src/types/response/ApiError';
import { Deal } from 'src/types/response/Deal';
import { FileCategory } from 'src/types/response/FileDTO';
import { DealTranslationFormProps } from 'src/types/TranslationForm';
import { createLanguageHeader, getTranslationValueObject } from 'src/utils';
import {
  CreateEntityAction,
  UpdateEntityRequestAction,
} from 'src/utils/basic-crud.action.types';
import { createEntityCrudSagas } from 'src/utils/saga.utils';

export const sagas = createEntityCrudSagas(
  actions,
  api.deal,
  dealSchema,
  FileCategory.dealPicture
);

export function* createDeal(
  action: CreateEntityAction<Deal, DealTranslationFormProps>
) {
  try {
    const { mallId, data, translations } = action.payload;
    const pictureFile = data.pictureFile;
    const language = yield select((s: ApplicationState) => s.locale.lang);
    if (!pictureFile) {
      throw {
        statusCode: 500,
        message: 'empty file',
        error: 'file is a required field',
      } as ApiError;
    }
    delete data.pictureFile;
    const response: Deal = yield call(api.deal.create, mallId, data);
    const id = response.id;
    const { entities, result: ids } = normalize([response], dealListSchema);
    yield all([
      call(sagas.uploadFile, mallId, response.id, pictureFile, language),
      call(translateDealLanguages, mallId, response.id, translations),
    ]);
    yield put(actions.createEntitySuccess(ids, entities));
    yield put(actions.fetchEntity(mallId, id));
  } catch (e) {
    yield put(actions.createEntityFailure(e));
  }
}

export function* updateDeal(
  action: UpdateEntityRequestAction<Deal, DealTranslationFormProps>
) {
  try {
    const { mallId, data, id, translations } = action.payload;
    const pictureFile = data.pictureFile;
    delete data.pictureFile;
    const language = yield select((s: ApplicationState) => s.locale.lang);
    let response: Deal;
    if (!id) {
      response = yield call(api.deal.create, mallId, data);
    } else {
      response = yield call(api.deal.update, mallId, id, data);
    }
    const dealId = response.id;
    const { entities, result: mallIds } = normalize([response], dealListSchema);
    yield all([
      call(sagas.uploadFile, mallId, dealId, pictureFile, language),
      call(translateDealLanguages, mallId, dealId, translations),
    ]);
    yield put(actions.updateEntitySuccess(mallIds, entities));
    yield put(actions.fetchEntity(mallId, dealId));
  } catch (e) {
    yield put(actions.updateEntityFailure(e));
  }
}

function* translateDealLanguages(
  mallId: number,
  id: number,
  translation: TypedLooseObject<DealTranslationFormProps> = {}
) {
  const translationCalls = Object.keys(translation).map((lang) =>
    call(translateDeal, mallId, id, lang, translation[lang])
  );
  yield all(translationCalls);
}

function* translateDeal(
  mallId: number,
  id: number,
  language: string,
  translation: DealTranslationFormProps
) {
  try {
    const headers = createLanguageHeader(language);
    const translationValues = getTranslationValueObject(translation as any);
    const data: Partial<Deal> = translationValues;
    const pictureFile = data.pictureFile;
    delete data.pictureFile;
    if (Object.keys(data).length > 0) {
      yield call(api.deal.update, mallId, id, data, headers);
    }
    if (pictureFile) {
      yield call(sagas.uploadFile, mallId, id, pictureFile, language);
    }
    yield put(actions.entityTranslationSuccess(mallId, id, language));
  } catch (error) {
    yield put(actions.entityTranslationFailure(mallId, id, language));
  }
}

export const dealSagas = [
  takeEvery(types.FETCH_PAGED_LIST_REQUEST, sagas.fetchPagedMallEntities),
  takeEvery(types.FETCH_REQUEST, sagas.fetchEntity),
  takeEvery(types.CREATE_REQUEST, createDeal),
  takeEvery(types.UPDATE_REQUEST, updateDeal),
  takeEvery(types.DELETE_REQUEST, sagas.deleteEntity),
];
