import { Language } from 'src/types/lang';
import { createEntityCrudActions } from './basic-crud.action';
const entityName = 'test';
const { actions, types } = createEntityCrudActions(entityName);

const mallId = 1;
const data = {
  id: 2,
  name: 'test entity',
};

const translations = {
  es: {
    name: 'translated ',
  },
};

it('generates action types correctly', () => {
  expect(types.CREATE_FAILURE).toBe('TEST/CREATE_FAILURE');
  expect(types.CREATE_REQUEST).toBe('TEST/CREATE_REQUEST');
  expect(types.CREATE_SUCCESS).toBe('TEST/CREATE_SUCCESS');
  expect(types.FETCH_FAILURE).toBe('TEST/FETCH_FAILURE');
  expect(types.FETCH_LIST_FAILURE).toBe('TEST/FETCH_LIST_FAILURE');
  expect(types.FETCH_LIST_REQUEST).toBe('TEST/FETCH_LIST_REQUEST');
  expect(types.FETCH_LIST_SUCCESS).toBe('TEST/FETCH_LIST_SUCCESS');
  expect(types.FETCH_PAGED_LIST_FAILURE).toBe('TEST/FETCH_PAGED_LIST_FAILURE');
  expect(types.FETCH_PAGED_LIST_REQUEST).toBe('TEST/FETCH_PAGED_LIST_REQUEST');
  expect(types.FETCH_PAGED_LIST_SUCCESS).toBe('TEST/FETCH_PAGED_LIST_SUCCESS');
  expect(types.FETCH_REQUEST).toBe('TEST/FETCH_REQUEST');
  expect(types.FETCH_SUCCESS).toBe('TEST/FETCH_SUCCESS');
  expect(types.UPDATE_FAILURE).toBe('TEST/UPDATE_FAILURE');

  expect(types.UPDATE_REQUEST).toBe('TEST/UPDATE_REQUEST');
  expect(types.UPDATE_SUCCESS).toBe('TEST/UPDATE_SUCCESS');
  expect(types.DELETE_FAILURE).toBe('TEST/DELETE_FAILURE');
  expect(types.DELETE_REQUEST).toBe('TEST/DELETE_REQUEST');
  expect(types.DELETE_SUCCESS).toBe('TEST/DELETE_SUCCESS');
  expect(types.TRANSLATE).toBe('TEST/TRANSLATE');
  expect(types.TRANSLATE_SUCCESS).toBe('TEST/TRANSLATE_SUCCESS');
  expect(types.TRANSLATE_FAILURE).toBe('TEST/TRANSLATE_FAILURE');
  expect(types.RESOURCE_LINK_FAILED).toBe('TEST/RESOURCE_LINK_FAILED');
  expect(types.RESOURCE_UNLINK_FAILED).toBe('TEST/RESOURCE_UNLINK_FAILED');
});

test('createEntityAction is generated correctly ', () => {
  const { payload, type } = actions.createEntity(mallId, data, translations);
  expect(type).toEqual(types.CREATE_REQUEST);
  expect(payload.data).toEqual(data);
  expect(payload.mallId).toEqual(mallId);
  expect(payload.translations).toEqual(translations);
});

test('updateEntity is generated correctly ', () => {
  const { payload, type } = actions.updateEntity(
    mallId,
    data.id,
    data,
    translations
  );
  expect(type).toEqual(types.UPDATE_REQUEST);
  expect(payload.id).toEqual(data.id);
  expect(payload.data).toEqual(data);
  expect(payload.mallId).toEqual(mallId);
  expect(payload.translations).toEqual(translations);
});

test('deleteEntity is generated correctly ', () => {
  const { payload, type } = actions.deleteEntity(mallId, data.id);
  expect(type).toEqual(types.DELETE_REQUEST);
  expect(payload.id).toEqual(data.id);
  expect(payload.mallId).toEqual(mallId);
});

test('entityTranslationSuccess is generated correctly ', () => {
  const lang = Language.spanish;

  const { payload, type } = actions.entityTranslationSuccess(
    mallId,
    data.id,
    lang
  );
  expect(type).toEqual(types.TRANSLATE_SUCCESS);
  expect(payload.id).toEqual(data.id);
  expect(payload.mallId).toEqual(mallId);
  expect(payload.language).toEqual(lang);
});

test('entityTranslationFailure is generated correctly ', () => {
  const lang = Language.spanish;

  const { payload, type } = actions.entityTranslationFailure(
    mallId,
    data.id,
    lang
  );
  expect(type).toEqual(types.TRANSLATE_FAILURE);
  expect(payload.id).toEqual(data.id);
  expect(payload.mallId).toEqual(mallId);
  expect(payload.language).toEqual(lang);
});

test('fetchEntity is generated correctly ', () => {
  const lang = Language.spanish;
  const id = data.id;
  const { payload, type } = actions.fetchEntity(mallId, id, lang);
  expect(type).toEqual(types.FETCH_REQUEST);
  expect(payload.id).toEqual(id);
  expect(payload.mallId).toEqual(mallId);
  expect(payload.language).toEqual(lang);
});

test('fetchEntityList is generated correctly ', () => {
  const query = {
    page: 1,
  };
  const { payload, type } = actions.fetchEntityList(mallId, query);
  expect(type).toEqual(types.FETCH_LIST_REQUEST);
  expect(payload.mallId).toEqual(mallId);
  expect(payload.query).toEqual(query);
});

test('fetchPagedEntityList is generated correctly ', () => {
  const page = 2;
  const limit = 100;
  const query = {
    page: 1,
  };
  const { payload, type } = actions.fetchPagedEntityList(
    mallId,
    page,
    limit,
    query
  );
  expect(type).toEqual(types.FETCH_PAGED_LIST_REQUEST);
  expect(payload.mallId).toEqual(mallId);
  expect(payload.query).toEqual(query);
  expect(payload.page).toEqual(page);
  expect(payload.pageSize).toEqual(limit);
});
