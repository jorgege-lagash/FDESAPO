import { normalize } from 'normalizr';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { actions, types } from 'src/actions/featured-space.action';
import * as api from 'src/api';
import { ApplicationState } from 'src/reducers';
import {
  featuredSpaceListSchema,
  featuredSpaceSchema,
} from 'src/schemas/featured-space.schema';
import { TypedLooseObject } from 'src/types/LooseObject';
import { ApiError } from 'src/types/response/ApiError';
import { FeaturedSpace } from 'src/types/response/FeaturedSpace';
import { FileCategory, FileDTO } from 'src/types/response/FileDTO';
import { FeaturedSpaceTranslationFormProps } from 'src/types/TranslationForm';
import { createLanguageHeader, getTranslationValueObject } from 'src/utils';
import {
  CreateEntityAction,
  UpdateEntityRequestAction,
} from 'src/utils/basic-crud.action.types';
import { createEntityCrudSagas } from 'src/utils/saga.utils';

const sagas = createEntityCrudSagas(
  actions,
  api.featuredSpace,
  featuredSpaceSchema
);

export function* createFeaturedSpaceFeaturedSpace(
  action: CreateEntityAction<FeaturedSpace, FeaturedSpaceTranslationFormProps>
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
    const response: FeaturedSpace = yield call(
      api.featuredSpace.create,
      mallId,
      data
    );
    const id = response.id;
    const { entities, result: ids } = normalize(
      [response],
      featuredSpaceListSchema
    );
    yield all([
      call(uploadFile, mallId, response.id, pictureFile, language),
      call(translateFeaturedSpaceLanguages, mallId, response.id, translations),
    ]);
    yield put(actions.createEntitySuccess(ids, entities));
    yield put(actions.fetchEntity(mallId, id));
  } catch (e) {
    yield put(actions.createEntityFailure(e));
  }
}

export function* updateFeaturedSpaceFeaturedSpace(
  action: UpdateEntityRequestAction<
    FeaturedSpace,
    FeaturedSpaceTranslationFormProps
  >
) {
  try {
    const { mallId, data, id, translations } = action.payload;
    const pictureFile = data.pictureFile;
    delete data.pictureFile;
    const language = yield select((s: ApplicationState) => s.locale.lang);
    const response: FeaturedSpace = yield call(
      api.featuredSpace.update,
      mallId,
      id,
      data
    );
    const { entities, result: mallIds } = normalize(
      [response],
      featuredSpaceListSchema
    );
    yield all([
      call(uploadFile, mallId, id, pictureFile, language),
      call(translateFeaturedSpaceLanguages, mallId, id, translations),
    ]);
    yield put(actions.updateEntitySuccess(mallIds, entities));
    yield put(actions.fetchEntity(mallId, id));
  } catch (e) {
    yield put(actions.updateEntityFailure(e));
  }
}

function* translateFeaturedSpaceLanguages(
  mallId: number,
  id: number,
  translation: TypedLooseObject<FeaturedSpaceTranslationFormProps>
) {
  const languageKeys = Object.keys(translation);
  for (const lang of languageKeys) {
    yield call(translateFeaturedSpace, mallId, id, lang, translation[lang]);
  }
}

function* translateFeaturedSpace(
  mallId: number,
  id: number,
  language: string,
  translation: FeaturedSpaceTranslationFormProps
) {
  try {
    const translationValues = getTranslationValueObject(translation as any);
    const data: Partial<FeaturedSpace> = translationValues;
    const pictureFile = data.pictureFile;
    delete data.pictureFile;

    const headers = createLanguageHeader(language);
    const body = { language };

    if (pictureFile) {
      const file: FileDTO = yield call(
        api.file.handleFileUpload,
        mallId,
        pictureFile,
        FileCategory.featureSpace
      );

      yield call(
        api.featuredSpace.linkImage,
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
      FileCategory.featureSpace
    );

    yield call(api.featuredSpace.linkImage, mallId, id, file.id, body, headers);
    yield put(actions.featuredSpaceLogoUploadSuccess(mallId, mallId, id));
  } catch (error) {
    yield put(actions.featuredSpaceLogoUploadFailure(mallId, mallId));
  }
}

export const featuredSpaceSagas = [
  takeEvery(types.FETCH_REQUEST, sagas.fetchEntity),
  takeEvery(types.FETCH_PAGED_LIST_REQUEST, sagas.fetchPagedMallEntities),
  takeEvery(types.CREATE_REQUEST, createFeaturedSpaceFeaturedSpace),
  takeEvery(types.UPDATE_REQUEST, updateFeaturedSpaceFeaturedSpace),
  takeEvery(types.DELETE_REQUEST, sagas.deleteEntity),
];
