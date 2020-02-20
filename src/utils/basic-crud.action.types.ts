import {
  GenericEntitySuccessActionCreator,
  GenericRequestFailureActionCreator,
} from 'src/actions/action-utils';
import { Action } from 'src/types/Action';
import { Language } from 'src/types/lang';
import { LooseObject, TypedLooseObject } from 'src/types/LooseObject';
import { ApiError } from 'src/types/response/ApiError';

export interface UpdateEntityRequestAction<T, TranslationProps = any>
  extends Action {
  payload: {
    mallId: number;
    id: number;
    data: T;
    translations?: TypedLooseObject<TranslationProps>;
    pictureFile?: File;
  };
}

export interface CreateEntityAction<T, TranslationProps = any> extends Action {
  payload: {
    mallId: number;
    data: T;
    translations?: TypedLooseObject<TranslationProps>;
    pictureFile?: File;
  };
}

export interface EntityListRequestAction extends Action {
  payload: { mallId: number; query?: LooseObject };
}

export interface EntityRequestAction extends Action {
  payload: {
    mallId: number;
    id: number;
    language?: Language;
    query?: LooseObject;
  };
}

export interface PagedEntityListRequestAction extends Action {
  payload: {
    mallId: number;
    page: number;
    pageSize: number;
    query?: LooseObject;
  };
}

export type FetchEntityListActionCreator = (
  mallId: number,
  query?: LooseObject
) => EntityListRequestAction;

export type FetchPagedEntityListActionCreator = (
  mallId: number,
  page: number,
  pageSize: number,
  query?: LooseObject
) => PagedEntityListRequestAction;

export type EntityByIdActionCreator = (
  mallId: number,
  id: number,
  language?: Language,
  query?: LooseObject
) => EntityRequestAction;

export type DeleteEntityByIdActionCreator = (
  mallId: number,
  id: number
) => EntityRequestAction;

export type UpdateEntityActionCreator<T, TranslationProps> = (
  mallId: number,
  id: number,
  data: Partial<T>,
  translations?: TypedLooseObject<TranslationProps>
) => UpdateEntityRequestAction<Partial<T>, TranslationProps>;

export type CreateEntityActionCreator<T, TranslationProps> = (
  mallId: number,
  data: T,
  translations?: TypedLooseObject<TranslationProps>
) => CreateEntityAction<T>;
export interface EntityCrudActions<T, TranslationProps = any> {
  createEntity: CreateEntityActionCreator<T, TranslationProps>;
  createEntityFailure: GenericRequestFailureActionCreator;
  createEntitySuccess: GenericEntitySuccessActionCreator;
  fetchEntityList: FetchEntityListActionCreator;
  fetchEntityListSuccess: GenericEntitySuccessActionCreator;
  fetchEntityListFailure: GenericRequestFailureActionCreator;
  fetchAllPagedEntityList: FetchPagedEntityListActionCreator;
  fetchPagedEntityList: FetchPagedEntityListActionCreator;
  fetchPagedEntityListSuccess: GenericEntitySuccessActionCreator;
  fetchPagedEntityListFailure: GenericRequestFailureActionCreator;
  fetchEntity: EntityByIdActionCreator;
  fetchEntitySuccess: GenericEntitySuccessActionCreator;
  fetchEntityFailure: GenericRequestFailureActionCreator;
  updateEntity: UpdateEntityActionCreator<T, TranslationProps>;
  updateEntitySuccess: GenericEntitySuccessActionCreator;
  updateEntityFailure: GenericRequestFailureActionCreator;
  deleteEntity: DeleteEntityByIdActionCreator;
  deleteEntitySuccess: GenericEntitySuccessActionCreator;
  deleteEntityFailure: GenericRequestFailureActionCreator;
  entityTranslationSuccess: EntityTranslationSuccessActionCreator;
  entityTranslationFailure: EntityTranslationFailureActionCreator;
  entityResourceLinkFailed: EntityResourceLinkFailedActionCreator;
  entityResourceLinkSuccess: EntityResourceLinkSuccessActionCreator;
}

export interface EntityCrudActionsTypes {
  CREATE_FAILURE: string;
  CREATE_REQUEST: string;
  CREATE_SUCCESS: string;
  FETCH_FAILURE: string;
  FETCH_LIST_FAILURE: string;
  FETCH_LIST_REQUEST: string;
  FETCH_LIST_SUCCESS: string;
  FETCH_ALL_PAGED_LIST_REQUEST: string;
  FETCH_PAGED_LIST_FAILURE: string;
  FETCH_PAGED_LIST_REQUEST: string;
  FETCH_PAGED_LIST_SUCCESS: string;
  FETCH_REQUEST: string;
  FETCH_SUCCESS: string;
  UPDATE_FAILURE: string;
  UPDATE_REQUEST: string;
  UPDATE_SUCCESS: string;
  DELETE_FAILURE: string;
  DELETE_REQUEST: string;
  DELETE_SUCCESS: string;
  TRANSLATE: string;
  TRANSLATE_SUCCESS: string;
  TRANSLATE_FAILURE: string;
  RESOURCE_LINK_FAILED: string;
  RESOURCE_UNLINK_FAILED: string;
}

export interface EntityCrudActionObject<T, TranslationProps> {
  types: EntityCrudActionsTypes;
  actions: EntityCrudActions<T, TranslationProps>;
}

export interface EntityTranslationSuccessAction extends Action {
  payload: {
    mallId: number;
    id: number;
    language: string;
  };
}

export interface EntityTranslationFailureAction extends Action {
  payload: {
    mallId: number;
    id: number;
    language: string;
  };
}

export type EntityTranslationSuccessActionCreator = (
  mallId: number,
  id: number,
  language: string
) => EntityTranslationSuccessAction;

export type EntityTranslationFailureActionCreator = (
  mallId: number,
  id: number,
  language: string
) => EntityTranslationFailureAction;

export interface EntityResourceLinkFailedAction extends Action {
  payload: {
    id: number;
    resource: string;
    resourceId: number;
    error: ApiError;
  };
}

export interface EntityResourceLinkSuccessAction extends Action {
  payload: {
    id: number;
    resource: string;
    resourceId: number;
  };
}

export type EntityResourceLinkFailedActionCreator = (
  id: number,
  resource: string,
  resourceId: number,
  error: ApiError
) => EntityResourceLinkFailedAction;

export type EntityResourceLinkSuccessActionCreator = (
  id: number,
  resource: string,
  resourceId: number
) => EntityResourceLinkSuccessAction;
