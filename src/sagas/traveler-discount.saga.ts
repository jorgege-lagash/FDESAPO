import { normalize } from 'normalizr';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { actions, types } from 'src/actions/traveler-discount.action';
import * as api from 'src/api';
import { ApplicationState } from 'src/reducers';
import {
  travelerDiscountListSchema,
  travelerDiscountSchema,
} from 'src/schemas/traveler-discount.schema';
import { TypedLooseObject } from 'src/types/LooseObject';
import { ApiError } from 'src/types/response/ApiError';
import { FileCategory, FileDTO } from 'src/types/response/FileDTO';
import { TravelerDiscount } from 'src/types/response/TravelerDiscount';
import { TravelerDiscountTranslationProps } from 'src/types/TranslationForm';
import { createLanguageHeader, getTranslationValueObject } from 'src/utils';
import {
  CreateEntityAction,
  UpdateEntityRequestAction,
} from 'src/utils/basic-crud.action.types';
import { createEntityCrudSagas } from 'src/utils/saga.utils';

const sagas = createEntityCrudSagas(
  actions,
  api.travelerDiscount,
  travelerDiscountSchema
);
export function* createTravelerDiscount(
  action: CreateEntityAction<TravelerDiscount, TravelerDiscountTranslationProps>
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
    const response: TravelerDiscount = yield call(
      api.travelerDiscount.create,
      mallId,
      data
    );
    const id = response.id;
    const { entities, result: ids } = normalize(
      [response],
      travelerDiscountListSchema
    );
    yield all([
      call(uploadFile, mallId, response.id, pictureFile, language),
      call(
        translateTravelerDiscountLanguages,
        mallId,
        response.id,
        translations
      ),
    ]);
    yield put(actions.createEntitySuccess(ids, entities));
    yield put(actions.fetchEntity(mallId, id));
  } catch (e) {
    yield put(actions.createEntityFailure(e));
  }
}

export function* updateTravelerDiscount(
  action: UpdateEntityRequestAction<
    TravelerDiscount,
    TravelerDiscountTranslationProps
  >
) {
  try {
    const { mallId, data, id, translations } = action.payload;
    const pictureFile = data.pictureFile;
    delete data.pictureFile;
    const language = yield select((s: ApplicationState) => s.locale.lang);
    let response: TravelerDiscount;
    if (!id) {
      response = yield call(api.travelerDiscount.create, mallId, data);
    } else {
      response = yield call(api.travelerDiscount.update, mallId, id, data);
    }
    const discountId = response.id;
    const { entities, result: mallIds } = normalize(
      [response],
      travelerDiscountListSchema
    );
    yield all([
      call(uploadFile, mallId, discountId, pictureFile, language),
      call(
        translateTravelerDiscountLanguages,
        mallId,
        discountId,
        translations
      ),
    ]);
    yield put(actions.updateEntitySuccess(mallIds, entities));
    yield put(actions.fetchEntity(mallId, discountId));
  } catch (e) {
    yield put(actions.updateEntityFailure(e));
  }
}

function* translateTravelerDiscountLanguages(
  mallId: number,
  id: number,
  translation: TypedLooseObject<TravelerDiscountTranslationProps> = {}
) {
  const languageKeys = Object.keys(translation);
  for (const lang of languageKeys) {
    yield call(translateTravelerDiscount, mallId, id, lang, translation[lang]);
  }
}

function* translateTravelerDiscount(
  mallId: number,
  id: number,
  language: string,
  translation: TravelerDiscountTranslationProps
) {
  try {
    const translationValues = getTranslationValueObject(translation as any);
    const data: Partial<TravelerDiscount> = translationValues;
    const pictureFile = data.discountPicture;
    delete data.pictureFile;

    const headers = createLanguageHeader(language);
    const body = { language };
    let response: TravelerDiscount;

    if (id) {
      response = yield call(
        api.travelerDiscount.update,
        mallId,
        id,
        data,
        headers
      );
    }

    if (pictureFile) {
      const file: FileDTO = yield call(
        api.file.handleFileUpload,
        mallId,
        pictureFile,
        FileCategory.travelerDiscount
      );

      yield call(
        api.travelerDiscount.linkImage,
        mallId,
        id,
        file.id,
        body,
        headers
      );
    }
    yield put(actions.entityTranslationSuccess(mallId, id, language));
  } catch (error) {
    yield put(actions.entityTranslationFailure(mallId, id, language));
  }
}

function* uploadFile(
  mallId: number,
  id: number,
  pictureFile: File,
  language: string
) {
  if (!pictureFile) {
    return;
  }
  try {
    const headers = createLanguageHeader(language);
    const body = { language };

    const file: FileDTO = yield call(
      api.file.handleFileUpload,
      mallId,
      pictureFile,
      FileCategory.travelerDiscount
    );

    yield call(
      api.travelerDiscount.linkImage,
      mallId,
      id,
      file.id,
      body,
      headers
    );
    yield put(actions.travelerDiscountPictureUploadSuccess(mallId, mallId, id));
  } catch (error) {
    yield put(actions.travelerDiscountPictureUploadFailure(mallId, mallId));
  }
}

export const travelerDiscountSagas = [
  takeEvery(types.FETCH_REQUEST, sagas.fetchEntity),
  takeEvery(types.FETCH_PAGED_LIST_REQUEST, sagas.fetchPagedMallEntities),
  takeEvery(types.CREATE_REQUEST, createTravelerDiscount),
  takeEvery(types.UPDATE_REQUEST, updateTravelerDiscount),
  takeEvery(types.DELETE_REQUEST, sagas.deleteEntity),
];
