import { Language } from 'src/types/lang';
import { LooseObject, TypedLooseObject } from 'src/types/LooseObject';
import { ApiError } from 'src/types/response/ApiError';
import {
  genericEntitySuccessAction,
  genericRequestFailureAction,
} from '../actions/action-utils';
import {
  CreateEntityAction,
  EntityCrudActionObject,
  EntityCrudActions,
  EntityCrudActionsTypes,
  EntityListRequestAction,
  EntityRequestAction,
  EntityResourceLinkFailedAction,
  EntityResourceLinkSuccessAction,
  EntityTranslationFailureAction,
  EntityTranslationFailureActionCreator,
  EntityTranslationSuccessAction,
  EntityTranslationSuccessActionCreator,
  FetchPagedEntityListActionCreator,
  PagedEntityListRequestAction,
  UpdateEntityActionCreator,
  UpdateEntityRequestAction,
} from './basic-crud.action.types';

const generateActionTypes = (uppercaseEntityName: string) => ({
  CREATE_FAILURE: `${uppercaseEntityName}/CREATE_FAILURE`,
  CREATE_REQUEST: `${uppercaseEntityName}/CREATE_REQUEST`,
  CREATE_SUCCESS: `${uppercaseEntityName}/CREATE_SUCCESS`,
  FETCH_FAILURE: `${uppercaseEntityName}/FETCH_FAILURE`,
  FETCH_LIST_FAILURE: `${uppercaseEntityName}/FETCH_LIST_FAILURE`,
  FETCH_LIST_REQUEST: `${uppercaseEntityName}/FETCH_LIST_REQUEST`,
  FETCH_LIST_SUCCESS: `${uppercaseEntityName}/FETCH_LIST_SUCCESS`,
  FETCH_ALL_PAGED_LIST_REQUEST: `${uppercaseEntityName}/FETCH_ALL_PAGED_LIST_REQUEST`,
  FETCH_PAGED_LIST_FAILURE: `${uppercaseEntityName}/FETCH_PAGED_LIST_FAILURE`,
  FETCH_PAGED_LIST_REQUEST: `${uppercaseEntityName}/FETCH_PAGED_LIST_REQUEST`,
  FETCH_PAGED_LIST_SUCCESS: `${uppercaseEntityName}/FETCH_PAGED_LIST_SUCCESS`,
  FETCH_REQUEST: `${uppercaseEntityName}/FETCH_REQUEST`,
  FETCH_SUCCESS: `${uppercaseEntityName}/FETCH_SUCCESS`,
  UPDATE_FAILURE: `${uppercaseEntityName}/UPDATE_FAILURE`,
  UPDATE_REQUEST: `${uppercaseEntityName}/UPDATE_REQUEST`,
  UPDATE_SUCCESS: `${uppercaseEntityName}/UPDATE_SUCCESS`,
  DELETE_FAILURE: `${uppercaseEntityName}/DELETE_FAILURE`,
  DELETE_REQUEST: `${uppercaseEntityName}/DELETE_REQUEST`,
  DELETE_SUCCESS: `${uppercaseEntityName}/DELETE_SUCCESS`,
  TRANSLATE: `${uppercaseEntityName}/TRANSLATE`,
  TRANSLATE_SUCCESS: `${uppercaseEntityName}/TRANSLATE_SUCCESS`,
  TRANSLATE_FAILURE: `${uppercaseEntityName}/TRANSLATE_FAILURE`,
  RESOURCE_LINK_FAILED: `${uppercaseEntityName}/RESOURCE_LINK_FAILED`,
  RESOURCE_UNLINK_FAILED: `${uppercaseEntityName}/RESOURCE_UNLINK_FAILED`,
});

export const createEntityCrudActions = <T, TranslationProps = any>(
  entityName: string
): EntityCrudActionObject<T, TranslationProps> => {
  const uppercaseEntityName = entityName.toUpperCase();
  const types: EntityCrudActionsTypes = generateActionTypes(
    uppercaseEntityName
  );

  const createEntity = (
    mallId: number,
    data: T,
    translations?: TypedLooseObject<TranslationProps>,
    pictureFile?: File
  ): CreateEntityAction<T> => {
    return {
      type: types.CREATE_REQUEST,
      payload: {
        mallId,
        data,
        translations,
        pictureFile,
      },
    };
  };

  const createEntitySuccess = genericEntitySuccessAction(types.CREATE_SUCCESS);
  const createEntityFailure = genericRequestFailureAction(types.CREATE_FAILURE);

  const fetchEntityList = (
    mallId: number,
    query: LooseObject
  ): EntityListRequestAction => {
    return {
      type: types.FETCH_LIST_REQUEST,
      payload: { mallId, query },
    };
  };

  const fetchEntityListSuccess = genericEntitySuccessAction(
    types.FETCH_LIST_SUCCESS
  );
  const fetchEntityListFailure = genericRequestFailureAction(
    types.FETCH_LIST_SUCCESS
  );
  const fetchPagedEntityList: FetchPagedEntityListActionCreator = (
    mallId: number,
    page: number,
    pageSize: number,
    query?: LooseObject
  ): PagedEntityListRequestAction => {
    return {
      type: types.FETCH_PAGED_LIST_REQUEST,
      payload: { mallId, query, page, pageSize },
    };
  };

  const fetchAllPagedEntityList: FetchPagedEntityListActionCreator = (
    mallId: number,
    page: number,
    pageSize: number,
    query?: LooseObject
  ): PagedEntityListRequestAction => {
    return {
      type: types.FETCH_ALL_PAGED_LIST_REQUEST,
      payload: { mallId, query, page, pageSize },
    };
  };

  const fetchPagedEntityListSuccess = genericEntitySuccessAction(
    types.FETCH_PAGED_LIST_SUCCESS
  );
  const fetchPagedEntityListFailure = genericRequestFailureAction(
    types.FETCH_PAGED_LIST_SUCCESS
  );
  const fetchEntity = (
    mallId: number,
    id: number,
    language?: Language,
    query?: LooseObject
  ): EntityRequestAction => {
    return {
      type: types.FETCH_REQUEST,
      payload: { mallId, id, language, query },
    };
  };
  const fetchEntitySuccess = genericEntitySuccessAction(types.FETCH_SUCCESS);
  const fetchEntityFailure = genericRequestFailureAction(types.FETCH_SUCCESS);

  const deleteEntity = (mallId: number, id: number): EntityRequestAction => {
    return {
      type: types.DELETE_REQUEST,
      payload: { mallId, id },
    };
  };
  const deleteEntitySuccess = genericEntitySuccessAction(types.DELETE_SUCCESS);
  const deleteEntityFailure = genericRequestFailureAction(types.DELETE_FAILURE);

  const updateEntity: UpdateEntityActionCreator<T, TranslationProps> = (
    mallId: number,
    id: number,
    data: Partial<T>,
    translations?: TypedLooseObject<TranslationProps>,
    pictureFile?: File
  ): UpdateEntityRequestAction<Partial<T>, TranslationProps> => {
    return {
      type: types.UPDATE_REQUEST,
      payload: {
        mallId,
        id,
        data,
        translations,
        pictureFile,
      },
    };
  };
  const updateEntitySuccess = genericEntitySuccessAction(types.UPDATE_SUCCESS);
  const updateEntityFailure = genericRequestFailureAction(types.UPDATE_FAILURE);

  const entityTranslationSuccess: EntityTranslationSuccessActionCreator = (
    mallId: number,
    id: number,
    language: string
  ): EntityTranslationSuccessAction => ({
    type: types.TRANSLATE_SUCCESS,
    payload: {
      mallId,
      id,
      language,
    },
  });

  const entityTranslationFailure: EntityTranslationFailureActionCreator = (
    mallId: number,
    id: number,
    language: string
  ): EntityTranslationFailureAction => ({
    type: types.TRANSLATE_FAILURE,
    payload: {
      mallId,
      id,
      language,
    },
  });

  const entityResourceLinkFailed = (
    id: number,
    resource: string,
    resourceId: number,
    error: ApiError
  ): EntityResourceLinkFailedAction => ({
    type: types.RESOURCE_LINK_FAILED,
    payload: {
      id,
      resource,
      resourceId,
      error,
    },
  });

  const entityResourceLinkSuccess = (
    id: number,
    resource: string,
    resourceId: number
  ): EntityResourceLinkSuccessAction => ({
    type: types.RESOURCE_UNLINK_FAILED,
    payload: {
      id,
      resource,
      resourceId,
    },
  });

  const actions: EntityCrudActions<T, TranslationProps> = {
    createEntity,
    createEntityFailure,
    createEntitySuccess,
    deleteEntity,
    deleteEntityFailure,
    deleteEntitySuccess,
    entityTranslationFailure,
    entityTranslationSuccess,
    fetchEntity,
    fetchEntityFailure,
    fetchEntityList,
    fetchEntityListFailure,
    fetchEntityListSuccess,
    fetchEntitySuccess,
    fetchAllPagedEntityList,
    fetchPagedEntityList,
    fetchPagedEntityListFailure,
    fetchPagedEntityListSuccess,
    updateEntity,
    updateEntityFailure,
    updateEntitySuccess,
    entityResourceLinkFailed,
    entityResourceLinkSuccess,
  };
  return {
    types,
    actions,
  };
};
