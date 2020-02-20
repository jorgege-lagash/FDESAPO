import { normalize } from 'normalizr';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { actions, types } from 'src/actions/event-directory.action';
import * as api from 'src/api';
import { ApplicationState } from 'src/reducers';
import {
  eventDirectoryListSchema,
  eventDirectorySchema,
} from 'src/schemas/event-directory.schema';
import { TypedLooseObject } from 'src/types/LooseObject';
import { EventDirectory } from 'src/types/response/EventDirectory';
import { FileCategory, FileDTO } from 'src/types/response/FileDTO';
import { EventDirectoryTranslationFormProps } from 'src/types/TranslationForm';
import { createLanguageHeader, getTranslationValueObject } from 'src/utils';
import {
  CreateEntityAction,
  EntityListRequestAction,
  UpdateEntityRequestAction,
} from 'src/utils/basic-crud.action.types';
import { createEntityCrudSagas } from 'src/utils/saga.utils';

export function* fetchMallEvents(action: EntityListRequestAction) {
  try {
    const { mallId } = action.payload;
    const fetchEventsResponse: EventDirectory[] = yield call(
      api.eventDirectory.fetchAll,
      mallId
    );
    const { entities, result: eventIds } = normalize(
      fetchEventsResponse,
      eventDirectoryListSchema
    );

    yield put(actions.fetchEventDirectoryListSuccess(eventIds, entities));
  } catch (e) {
    yield put(actions.fetchEventDirectoryListFailure(e));
  }
}

const sagas = createEntityCrudSagas(
  actions,
  api.eventDirectory,
  eventDirectorySchema
);

function* createEventDirectory(action: CreateEntityAction<EventDirectory>) {
  try {
    const { mallId, data, translations } = action.payload;
    const pictureFile = data.pictureFile;
    const language = yield select((s: ApplicationState) => s.locale.lang);
    delete data.pictureFile;
    const response: EventDirectory = yield call(
      api.eventDirectory.create,
      mallId,
      data
    );
    const id = response.id;
    const { entities, result: ids } = normalize(
      [response],
      eventDirectoryListSchema
    );
    yield all([
      call(uploadFile, mallId, response.id, pictureFile, language),
      call(translateEventDirectoryLanguages, mallId, response.id, translations),
    ]);
    yield put(actions.createEntitySuccess(ids, entities));
    yield put(actions.fetchEntity(mallId, id));
  } catch (e) {
    yield put(actions.createEntityFailure(e));
  }
}

function* updateEventDirectory(
  action: UpdateEntityRequestAction<EventDirectory>
) {
  try {
    const { mallId, data, id, translations } = action.payload;
    const pictureFile = data.pictureFile;
    delete data.pictureFile;
    const language = yield select((s: ApplicationState) => s.locale.lang);
    const response: EventDirectory = yield call(
      api.eventDirectory.update,
      mallId,
      id,
      data
    );
    const { entities, result: mallIds } = normalize(
      [response],
      eventDirectoryListSchema
    );
    yield all([
      call(uploadFile, mallId, id, pictureFile, language),
      call(translateEventDirectoryLanguages, mallId, id, translations),
    ]);
    yield put(actions.updateEntitySuccess(mallIds, entities));
    yield put(actions.fetchEntity(mallId, id));
  } catch (e) {
    yield put(actions.updateEntityFailure(e));
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
      FileCategory.eventDirectory
    );

    yield call(
      api.eventDirectory.linkImage,
      mallId,
      id,
      file.id,
      body,
      headers
    );
    yield put(actions.eventDirectoryPictureUploadSuccess(mallId, mallId, id));
  } catch (error) {
    yield put(actions.eventDirectoryPictureUploadFailure(mallId, mallId));
  }
}

function* translateEventDirectoryLanguages(
  mallId: number,
  id: number,
  translation: TypedLooseObject<EventDirectoryTranslationFormProps>
) {
  const languageKeys = Object.keys(translation);
  for (const lang of languageKeys) {
    yield call(translateEventDirectory, mallId, id, lang, translation[lang]);
  }
}

function* translateEventDirectory(
  mallId: number,
  id: number,
  language: string,
  translation: EventDirectoryTranslationFormProps
) {
  try {
    const translationValues = getTranslationValueObject(translation as any);
    const data: Partial<EventDirectory> = translationValues;
    const pictureFile = data.pictureFile;
    delete data.pictureFile;
    const headers = { 'accept-language': language };
    const body = { language };
    yield call(api.eventDirectory.update, mallId, id, data, headers);

    if (pictureFile) {
      const file: FileDTO = yield call(
        api.file.handleFileUpload,
        mallId,
        pictureFile,
        FileCategory.eventDirectory
      );

      yield call(
        api.eventDirectory.linkImage,
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

export const eventDirectorySagas = [
  takeEvery(types.FETCH_PAGED_LIST_REQUEST, sagas.fetchPagedMallEntities),
  takeEvery(types.FETCH_REQUEST, sagas.fetchEntity),
  takeEvery(types.CREATE_REQUEST, createEventDirectory),
  takeEvery(types.UPDATE_REQUEST, updateEventDirectory),
  takeEvery(types.DELETE_REQUEST, sagas.deleteEntity),
];
