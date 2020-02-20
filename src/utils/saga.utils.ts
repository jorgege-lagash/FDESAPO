import { normalize, schema } from 'normalizr';
import { all, call, put, select } from 'redux-saga/effects';

import {
  CreateEntityAction,
  EntityCrudActions,
  EntityListRequestAction,
  EntityRequestAction,
  PagedEntityListRequestAction,
  UpdateEntityRequestAction,
} from 'src/utils/basic-crud.action.types';

import { file as fileApi } from 'src/api/file.api';
import { ApplicationState } from 'src/reducers';
import { Language } from 'src/types/lang';
import { TypedLooseObject } from 'src/types/LooseObject';
import { FileCategory, UploadedFileResult } from 'src/types/response/FileDTO';
import { PageData } from 'src/types/response/PaginatedData';
import { BasicCrudRequests } from 'src/utils/basic-crud.api';
import { createLanguageHeader, getTranslationValueObject } from '.';
import { CustomHeaders } from './request';

export const createEntityCrudSagas = <T, TranslationProps = any>(
  actions: EntityCrudActions<T, TranslationProps>,
  apiEndpoints: BasicCrudRequests<T>,
  entitySchema: schema.Entity,
  entityFileCategory?: FileCategory
  // tslint:disable-next-line:no-big-function
) => {
  const listSchema = [entitySchema];

  function* fetchMallEntities(action: EntityListRequestAction) {
    try {
      const { mallId, query } = action.payload;

      const response: T[] = yield call(apiEndpoints.fetchAll, mallId, query);

      const { entities, result: ids } = normalize(response, listSchema);

      yield put(actions.fetchEntityListSuccess(ids, entities));
    } catch (e) {
      yield put(actions.fetchEntityListFailure(e));
    }
  }

  function* fetchPagedMallEntities(action: PagedEntityListRequestAction) {
    const { mallId, page, pageSize, query } = action.payload;
    try {
      const response: PageData<T> = yield call(
        apiEndpoints.fetchPage,
        mallId,
        page,
        pageSize,
        undefined,
        query
      );
      const { pagination } = response;
      const { entities, result: mallIds } = normalize(
        response.data,
        listSchema
      );
      yield put(
        actions.fetchPagedEntityListSuccess(
          mallIds,
          entities,
          pagination.totalItems,
          page,
          pageSize
        )
      );
    } catch (e) {
      yield put(actions.fetchPagedEntityListFailure(e));
    }
  }

  function* fetchAllPagedMallEntities(action: PagedEntityListRequestAction) {
    const { mallId, query } = action.payload;
    try {
      const pageSize = 200;
      let page = 1;
      let totalPages = 1;
      let response: PageData<T>;

      for (page = 1; page <= totalPages; page++) {
        response = yield call(
          apiEndpoints.fetchPage,
          mallId,
          page,
          pageSize,
          undefined,
          query
        );
        totalPages = response.pagination.totalPages;
        const { entities, result: ids } = normalize(response.data, listSchema);
        yield put(
          actions.fetchPagedEntityListSuccess(
            ids,
            entities,
            response.pagination.totalItems,
            page,
            pageSize
          )
        );
      }
    } catch (e) {
      yield put(actions.fetchPagedEntityListFailure(e));
    }
  }

  function* fetchEntity(action: EntityRequestAction) {
    try {
      const { mallId, id, language, query } = action.payload;
      const customHeaders: CustomHeaders = {
        ...(language && createLanguageHeader(language)),
      };
      const response: T = yield call(
        apiEndpoints.fetchById,
        mallId,
        id,
        query,
        customHeaders
      );

      const { entities, result: ids } = normalize([response], listSchema);

      yield put(
        actions.fetchEntitySuccess(
          ids,
          entities,
          undefined,
          undefined,
          undefined,
          language
        )
      );
    } catch (e) {
      yield put(actions.fetchEntityFailure(e));
    }
  }

  function* deleteEntity(action: EntityRequestAction) {
    try {
      const { mallId, id } = action.payload;

      yield call(apiEndpoints.delete, mallId, id);

      const ids = [id];
      const entities = {
        [entitySchema.key]: {
          [id]: undefined,
        },
      };
      yield put(actions.deleteEntitySuccess(ids, entities));
    } catch (e) {
      yield put(actions.deleteEntityFailure(e));
    }
  }

  function* createMallEntity(action: CreateEntityAction<T>) {
    try {
      const language = yield select((s: ApplicationState) => s.locale.lang);
      const { mallId, data, translations, pictureFile } = action.payload;

      const response = yield call(apiEndpoints.create, mallId, data);

      const { entities, result: ids } = normalize([response], listSchema);

      yield put(actions.createEntitySuccess(ids, entities));
      yield all([
        call(translateEntityLanguages, mallId, response.id, translations),
        call(uploadFile, mallId, response.id, pictureFile, language),
      ]);
    } catch (e) {
      yield put(actions.createEntityFailure(e));
    }
  }

  function* uploadFile(
    mallId: number,
    id: number,
    file: File,
    language: Language
  ) {
    if (!file) {
      return;
    }
    if (!entityFileCategory) {
      throw {
        message: 'undefined file category in CRUD saga',
        entity: entitySchema,
      };
    }
    try {
      const headers = createLanguageHeader(language);
      const body = { language };
      const fileResponse: UploadedFileResult = yield call(
        fileApi.handleFileUpload,
        mallId,
        file,
        entityFileCategory
      );
      yield call(
        apiEndpoints.linkUploadedFile,
        mallId,
        id,
        fileResponse.id,
        body,
        headers
      );
      yield put(
        actions.entityResourceLinkSuccess(id, 'picture', fileResponse.id)
      );
    } catch (error) {
      yield put(actions.entityResourceLinkFailed(id, 'picture', 0, error));
    }
  }

  function* updateMallEntity(
    action: UpdateEntityRequestAction<T, TranslationProps>
  ) {
    const { mallId, id, data, translations, pictureFile } = action.payload;
    try {
      const language = yield select((s: ApplicationState) => s.locale.lang);
      const response = yield call(apiEndpoints.update, mallId, id, data);
      const { entities, result: ids } = normalize([response], listSchema);

      yield put(actions.updateEntitySuccess(ids, entities));
      yield all([
        call(translateEntityLanguages, mallId, response.id, translations),
        call(uploadFile, mallId, response.id, pictureFile, language),
      ]);
    } catch (e) {
      if (e.statusCode === 404) {
        yield put(actions.createEntity(mallId, data));
        return;
      }
      yield put(actions.updateEntityFailure(e));
    }
  }

  function* translateEntityLanguages(
    mallId: number,
    id: number,
    translation: TypedLooseObject<TranslationProps>
  ) {
    const languageKeys = Object.keys(translation);
    for (const lang of languageKeys) {
      yield call(translateEntity, mallId, id, lang, translation[lang]);
    }
  }

  function* translateEntity(
    mallId: number,
    id: number,
    language: string,
    translation: TranslationProps
  ) {
    try {
      const translationValues: any = getTranslationValueObject(
        translation as any
      );

      const data: Partial<T> = translationValues;
      const headers = createLanguageHeader(language);
      yield call(apiEndpoints.update, mallId, id, data, headers);
      yield put(actions.entityTranslationSuccess(mallId, id, language));
    } catch (error) {
      yield put(actions.entityTranslationFailure(mallId, id, language));
    }
  }

  return {
    fetchMallEntities,
    fetchPagedMallEntities,
    fetchAllPagedMallEntities,
    fetchEntity,
    createMallEntity,
    updateMallEntity,
    deleteEntity,
    uploadFile,
  };
};
