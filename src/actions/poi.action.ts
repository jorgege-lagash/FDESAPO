import { Action } from 'src/types/Action';
import { Language } from 'src/types/lang';
import { LooseObject, TypedLooseObject } from 'src/types/LooseObject';
import { ApiError } from 'src/types/response/ApiError';
import { PoiFormData } from 'src/types/response/POI';
import { Tag } from 'src/types/response/Tag';
import { PoiTranslationFormProps } from 'src/types/TranslationForm';
import {
  genericEntitySuccessAction,
  genericRequestFailureAction,
} from './action-utils';

export const types = {
  ADD_SUC_CODES: 'POI/ADD_SUC_CODES',
  ADD_SUC_CODES_FAILURE: 'POI/ADD_SUC_CODES_FAILURE',
  CLEAR_SUC_CODES: 'POI/CLEAR_SUC_CODES',
  CREATE_POI_FAILURE: 'POI/CREATE_FAILURE',
  CREATE_POI_REQUEST: 'POI/CREATE_REQUEST',
  CREATE_POI_SUCCESS: 'POI/CREATE_SUCCESS',
  FETCH_ALL_SUC_CODES: 'POI/FETCH_ALL_SUC_CODES',
  FETCH_POI_FAILURE: 'POI/FETCH_FAILURE',
  FETCH_POI_LIST_FAILURE: 'POI/FETCH_POI_LIST_FAILURE',
  FETCH_POI_LIST_REQUEST: 'POI/FETCH_POI_LIST_REQUEST',
  FETCH_POI_LIST_SUCCESS: 'POI/FETCH_POI_LIST_SUCCESS',
  FETCH_POI_REQUEST: 'POI/FETCH_REQUEST',
  FETCH_POI_SUCCESS: 'POI/FETCH_SUCCESS',
  POI_LOGO_UPLOAD: 'POI/LOGO_UPLOAD',
  POI_LOGO_UPLOAD_FAILURE: 'POI/LOGO_UPLOAD_FAILURE',
  POI_LOGO_UPLOAD_SUCCESS: 'POI/LOGO_UPLOAD_SUCCESS',
  POI_RESOURCE_LINK_FAILED: 'POI/RESOURCE_LINK_FAILED',
  POI_RESOURCE_LINK_SUCCESS: 'POI/RESOURCE_LINK_SUCCESS',
  POI_RESOURCE_UNLINK_FAILED: 'POI/RESOURCE_UNLINK_FAILED',
  POI_RESOURCE_UNLINK_SUCCESS: 'POI/RESOURCE_UNLINK_SUCCESS',
  POI_TRANSLATE: 'POI/TRANSLATE',
  POI_TRANSLATE_FAILURE: 'POI/TRANSLATE_FAILURE',
  POI_TRANSLATE_SUCCESS: 'POI/TRANSLATE_SUCCESS',
  SELECT_POI: 'POI/SELECT_POI',
  UPDATE_POI_FAILURE: 'POI/UPDATE_POI_FAILURE',
  UPDATE_POI_REQUEST: 'POI/UPDATE_POI_REQUEST',
  UPDATE_POI_SUCCESS: 'POI/UPDATE_POI_SUCCESS',
};

export interface FetchPoiAction extends Action {
  payload: {
    mallId: number;
    id: number;
    language?: Language;
  };
}

export interface FetchPoiListAction extends Action {
  payload: {
    mallId: number;
    page: number;
    pageSize: number;
    query?: LooseObject;
  };
}

export interface FetchAllSucCodesAction extends Action {
  payload: {
    mallId: number;
  };
}

export interface AddSucCodesAction extends Action {
  payload: {
    codes: string[];
  };
}

export interface CreatePoiRequestAction extends Action {
  payload: {
    mallId: number;
    poi: PoiFormData;
    categories: number[];
    tags: { ids: number[]; newTags: Tag[] };
    translations: TypedLooseObject<PoiTranslationFormProps>;
  };
}

const fetchPoi = (
  mallId: number,
  id: number,
  language?: Language
): FetchPoiAction => {
  return {
    type: types.FETCH_POI_REQUEST,
    payload: {
      mallId,
      id,
      language,
    },
  };
};

const fetchPoiSuccess = genericEntitySuccessAction(types.FETCH_POI_SUCCESS);

const fetchPoiFailure = genericRequestFailureAction(types.FETCH_POI_FAILURE);

const fetchPoiList = (
  mallId: number,
  page?: number,
  pageSize?: number,
  query?: LooseObject
): FetchPoiListAction => {
  return {
    type: types.FETCH_POI_LIST_REQUEST,
    payload: {
      mallId,
      page: page || 1,
      pageSize: pageSize || 10,
      query,
    },
  };
};

const fetchPoiListSuccess = genericEntitySuccessAction(
  types.FETCH_POI_LIST_SUCCESS
);

const fetchPoiListFailure = genericRequestFailureAction(
  types.FETCH_POI_LIST_SUCCESS
);

const createPoi = (
  mallId: number,
  poi: PoiFormData,
  categories: number[],
  tags: { ids: number[]; newTags: Tag[] },
  translations: TypedLooseObject<PoiTranslationFormProps>
): CreatePoiRequestAction => {
  return {
    type: types.CREATE_POI_REQUEST,
    payload: {
      mallId,
      poi,
      categories,
      tags,
      translations,
    },
  };
};

const createPoiSuccess = genericEntitySuccessAction(types.CREATE_POI_SUCCESS);

const createPoiFailure = genericRequestFailureAction(types.CREATE_POI_FAILURE);
export interface UpdatePoiRequestAction extends Action {
  payload: {
    mallId: number;
    id: number;
    data: Partial<PoiFormData>;
    tags: { ids: number[]; newTags: Tag[] };
    translations: TypedLooseObject<PoiTranslationFormProps>;
  };
}
const updatePoi = (
  mallId: number,
  id: number,
  data: Partial<PoiFormData>,
  tags: { ids: number[]; newTags: Tag[] },
  translations: TypedLooseObject<PoiTranslationFormProps>
): UpdatePoiRequestAction => {
  return {
    type: types.UPDATE_POI_REQUEST,
    payload: {
      mallId,
      id,
      data,
      tags,
      translations,
    },
  };
};

const updatePoiSuccess = genericEntitySuccessAction(types.UPDATE_POI_SUCCESS);

const updatePoiFailure = genericRequestFailureAction(types.UPDATE_POI_FAILURE);

const fetchAllSucCodes = (mallId: number): FetchAllSucCodesAction => ({
  type: types.FETCH_ALL_SUC_CODES,
  payload: {
    mallId,
  },
});

const addSucCodes = (mallId: number, codes: string[]): AddSucCodesAction => ({
  type: types.ADD_SUC_CODES,
  payload: {
    codes,
  },
});

const addSucFailure = genericRequestFailureAction(types.ADD_SUC_CODES_FAILURE);

const clearSucCodes = (mallId?: number): Action => ({
  type: types.CLEAR_SUC_CODES,
});

export interface ResourceLinkFailedAction extends Action {
  payload: {
    poiId: number;
    resource: string;
    resourceId: number;
    error: ApiError;
  };
}

const resourceLinkFailed = (
  poiId: number,
  resource: string,
  resourceId: number,
  error: ApiError
): ResourceLinkFailedAction => ({
  type: types.POI_RESOURCE_LINK_FAILED,
  payload: {
    poiId,
    resource,
    resourceId,
    error,
  },
});

export interface ResourceLinkSuccessAction extends Action {
  payload: {
    poiId: number;
    resource: string;
    resourceId: number;
  };
}

const resourceLinkSuccess = (
  poiId: number,
  resource: string,
  resourceId: number
): ResourceLinkSuccessAction => ({
  type: types.POI_RESOURCE_LINK_SUCCESS,
  payload: {
    poiId,
    resource,
    resourceId,
  },
});

export interface PoiLogoUploadSuccessAction extends Action {
  payload: {
    mallId: number;
    poiId: number;
    fileId: number;
  };
}

const poiLogoUploadSuccess = (
  mallId: number,
  poiId: number,
  fileId: number
): PoiLogoUploadSuccessAction => ({
  type: types.POI_LOGO_UPLOAD_SUCCESS,
  payload: {
    mallId,
    poiId,
    fileId,
  },
});

export interface PoiLogoUploadFailureAction extends Action {
  payload: {
    mallId: number;
    poiId: number;
  };
}

const poiLogoUploadFailure = (
  mallId: number,
  poiId: number
): PoiLogoUploadFailureAction => ({
  type: types.POI_LOGO_UPLOAD_FAILURE,
  payload: {
    mallId,
    poiId,
  },
});

export interface PoiTranslateSuccessAction extends Action {
  payload: {
    mallId: number;
    poiId: number;
    language: string;
  };
}

const poiTranslateSuccess = (
  mallId: number,
  poiId: number,
  language: string
): PoiTranslateSuccessAction => ({
  type: types.POI_TRANSLATE_SUCCESS,
  payload: {
    mallId,
    poiId,
    language,
  },
});

export interface PoiTranslateFailureAction extends Action {
  payload: {
    mallId: number;
    poiId: number;
    language: string;
  };
}

const poiTranslateFailure = (
  mallId: number,
  poiId: number,
  language: string
): PoiTranslateFailureAction => ({
  type: types.POI_TRANSLATE_FAILURE,
  payload: {
    mallId,
    poiId,
    language,
  },
});

export interface ResourceUnlinkFailedAction extends Action {
  payload: {
    poiId: number;
    resource: string;
    resourceId: number;
  };
}

export interface ResourceUnlinkSuccessAction extends Action {
  payload: {
    poiId: number;
    resource: string;
    resourceId: number;
  };
}

const resourceUnlinkFailed = (
  poiId: number,
  resource: string,
  resourceId: number
): ResourceUnlinkFailedAction => ({
  type: types.POI_RESOURCE_UNLINK_FAILED,
  payload: {
    poiId,
    resource,
    resourceId,
  },
});

const resourceUnlinkSuccess = (
  poiId: number,
  resource: string,
  resourceId: number
): ResourceUnlinkSuccessAction => ({
  type: types.POI_RESOURCE_UNLINK_SUCCESS,
  payload: {
    poiId,
    resource,
    resourceId,
  },
});

export const actions = {
  addSucCodes,
  addSucFailure,
  clearSucCodes,
  createPoi,
  createPoiFailure,
  createPoiSuccess,
  fetchAllSucCodes,
  fetchPoi,
  fetchPoiFailure,
  fetchPoiList,
  fetchPoiListFailure,
  fetchPoiListSuccess,
  fetchPoiSuccess,
  poiLogoUploadFailure,
  poiLogoUploadSuccess,
  poiTranslateFailure,
  poiTranslateSuccess,
  resourceLinkFailed,
  resourceLinkSuccess,
  resourceUnlinkFailed,
  resourceUnlinkSuccess,
  updatePoi,
  updatePoiFailure,
  updatePoiSuccess,
};
