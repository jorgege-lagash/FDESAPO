import { Action } from 'src/types/Action';
import { Language } from 'src/types/lang';
import { TypedLooseObject } from 'src/types/LooseObject';
import { MallTranslationFormProps } from 'src/types/TranslationForm';
import {
  CreateMallRequestAction,
  MallListRequestAction,
  UpdateMallRequestAction,
} from '../types/action/MallActions';
import { Mall } from '../types/Mall';
import {
  genericEntitySuccessAction,
  genericRequestFailureAction,
} from './action-utils';

export const types = {
  FETCH_MALL_FAILURE: 'MALL/FETCH_FAILURE',
  FETCH_MALL_REQUEST: 'MALL/FETCH_REQUEST',
  FETCH_MALL_SUCCESS: 'MALL/FETCH_SUCCESS',
  CREATE_MALL_FAILURE: 'MALL/CREATE_MALL_FAILURE',
  CREATE_MALL_REQUEST: 'MALL/CREATE_MALL_REQUEST',
  CREATE_MALL_SUCCESS: 'MALL/CREATE_MALL_SUCCESS',
  FETCH_MALL_LIST_FAILURE: 'MALL/FETCH_MALL_LIST_FAILURE',
  FETCH_MALL_LIST_REQUEST: 'MALL/FETCH_MALL_LIST_REQUEST',
  FETCH_MALL_LIST_SUCCESS: 'MALL/FETCH_MALL_LIST_SUCCESS',
  SELECT_MALL: 'MALL/SELECT_MALL',
  UPDATE_MALL_FAILURE: 'MALL/UPDATE_MALL_FAILURE',
  UPDATE_MALL_REQUEST: 'MALL/UPDATE_MALL_REQUEST',
  UPDATE_MALL_SUCCESS: 'MALL/UPDATE_MALL_SUCCESS',
  UPDATE_MALL_TERMS_FAILURE: 'MALL/UPDATE_MALL_TERMS_FAILURE',
  UPDATE_MALL_TERMS_REQUEST: 'MALL/UPDATE_MALL_TERMS_REQUEST',
  UPDATE_MALL_TERMS_SUCCESS: 'MALL/UPDATE_MALL_TERMS_SUCCESS',
  MALL_TRANSLATE: 'MALL/TRANSLATE',
  MALL_TRANSLATE_SUCCESS: 'MALL/TRANSLATE_SUCCESS',
  MALL_TRANSLATE_FAILURE: 'MALL/TRANSLATE_FAILURE',
};

const selectMall = (mallId: number | undefined) => {
  return {
    type: types.SELECT_MALL,
    payload: {
      mallId,
    },
  };
};

export interface FetchMallAction extends Action {
  payload: {
    mallId: number;
    language?: Language;
  };
}

const fetchMall = (mallId: number, language?: Language): FetchMallAction => {
  return {
    type: types.FETCH_MALL_REQUEST,
    payload: {
      mallId,
      language,
    },
  };
};

const fetchMallSuccess = genericEntitySuccessAction(types.FETCH_MALL_SUCCESS);

const fetchMallFailure = genericRequestFailureAction(types.FETCH_MALL_FAILURE);

const createMall = (
  userId: number,
  mall: Mall,
  translations: TypedLooseObject<MallTranslationFormProps> = {}
): CreateMallRequestAction => {
  return {
    type: types.CREATE_MALL_REQUEST,
    payload: {
      userId,
      mall,
      translations,
    },
  };
};

const createMallSuccess = genericEntitySuccessAction(types.CREATE_MALL_SUCCESS);

const createMallFailure = genericRequestFailureAction(
  types.CREATE_MALL_FAILURE
);

const fetchMallList = (): MallListRequestAction => {
  return {
    type: types.FETCH_MALL_LIST_REQUEST,
    payload: {},
  };
};

const fetchMallListSuccess = genericEntitySuccessAction(
  types.FETCH_MALL_LIST_SUCCESS
);

const fetchMallListFailure = genericRequestFailureAction(
  types.FETCH_MALL_LIST_FAILURE
);

const updateMall = (
  mallId: number,
  mall: Partial<Mall>,
  translations: TypedLooseObject<MallTranslationFormProps> = {}
): UpdateMallRequestAction => {
  return {
    type: types.UPDATE_MALL_REQUEST,
    payload: {
      mallId,
      mall,
      translations,
    },
  };
};

const updateMallSuccess = genericEntitySuccessAction(types.UPDATE_MALL_SUCCESS);

const updateMallFailure = genericRequestFailureAction(
  types.UPDATE_MALL_FAILURE
);

const updateMallTerms = (mallId: number, terms: string): Action => {
  return {
    type: types.UPDATE_MALL_TERMS_REQUEST,
    payload: {
      mallId,
      terms,
    },
  };
};

const updateMallTermsSuccess = genericEntitySuccessAction(
  types.UPDATE_MALL_TERMS_SUCCESS
);

const updateMallTermsFailure = genericRequestFailureAction(
  types.UPDATE_MALL_TERMS_FAILURE
);

export interface MallTranslateSuccessAction extends Action {
  payload: {
    mallId: number;
    language: string;
  };
}

const mallTranslateSuccess = (
  mallId: number,
  language: string
): MallTranslateSuccessAction => ({
  type: types.MALL_TRANSLATE_SUCCESS,
  payload: {
    mallId,
    language,
  },
});

export interface MallTranslateFailureAction extends Action {
  payload: {
    mallId: number;
    language: string;
  };
}

const mallTranslateFailure = (
  mallId: number,
  language: string
): MallTranslateFailureAction => ({
  type: types.MALL_TRANSLATE_FAILURE,
  payload: {
    mallId,
    language,
  },
});

export const actions = {
  createMall,
  createMallFailure,
  createMallSuccess,
  fetchMallList,
  fetchMallListFailure,
  fetchMallListSuccess,
  selectMall,
  updateMall,
  updateMallFailure,
  updateMallSuccess,
  updateMallTerms,
  updateMallTermsFailure,
  updateMallTermsSuccess,
  mallTranslateSuccess,
  mallTranslateFailure,
  fetchMall,
  fetchMallSuccess,
  fetchMallFailure,
};
