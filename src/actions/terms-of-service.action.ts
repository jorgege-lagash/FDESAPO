import {
  CreateTermsOfServiceRequestAction,
  TermsOfServiceListRequestAction,
  UpdateTermsOfServiceRequestAction,
} from '../types/action/TermsOfServiceActions';
import { TermsOfService } from '../types/response/TermsOfService';
import {
  genericEntitySuccessAction,
  genericRequestFailureAction,
} from './action-utils';

export const types = {
  CREATE_TERMS_FAILURE: 'TERMS/CREATE_TERMS_FAILURE',
  CREATE_TERMS_REQUEST: 'TERMS/CREATE_TERMS_REQUEST',
  CREATE_TERMS_SUCCESS: 'TERMS/CREATE_TERMS_SUCCESS',
  FETCH_TERMS_LIST_FAILURE: 'TERMS/FETCH_TERMS_LIST_FAILURE',
  FETCH_TERMS_LIST_REQUEST: 'TERMS/FETCH_TERMS_LIST_REQUEST',
  FETCH_TERMS_LIST_SUCCESS: 'TERMS/FETCH_TERMS_LIST_SUCCESS',
  UPDATE_TERMS_FAILURE: 'TERMS/UPDATE_TERMS_FAILURE',
  UPDATE_TERMS_REQUEST: 'TERMS/UPDATE_TERMS_REQUEST',
  UPDATE_TERMS_SUCCESS: 'TERMS/UPDATE_TERMS_SUCCESS',
};

const createTermsOfService = (
  mallId: number,
  termsOfService: TermsOfService
): CreateTermsOfServiceRequestAction => {
  return {
    type: types.CREATE_TERMS_REQUEST,
    payload: {
      mallId,
      termsOfService,
    },
  };
};

const createTermsOfServiceSuccess = genericEntitySuccessAction(
  types.CREATE_TERMS_SUCCESS
);

const createTermsOfServiceFailure = genericRequestFailureAction(
  types.CREATE_TERMS_FAILURE
);

const fetchTermsOfServiceList = (
  mallId: number
): TermsOfServiceListRequestAction => {
  return {
    type: types.FETCH_TERMS_LIST_REQUEST,
    payload: { mallId },
  };
};

const fetchTermsOfServiceListSuccess = genericEntitySuccessAction(
  types.FETCH_TERMS_LIST_SUCCESS
);

const fetchTermsOfServiceListFailure = genericRequestFailureAction(
  types.FETCH_TERMS_LIST_SUCCESS
);

const updateTermsOfService = (
  mallId: number,
  termsOfService: TermsOfService
): UpdateTermsOfServiceRequestAction => {
  return {
    type: types.UPDATE_TERMS_REQUEST,
    payload: {
      mallId,
      termsOfService,
    },
  };
};

const updateTermsOfServiceSuccess = genericEntitySuccessAction(
  types.UPDATE_TERMS_SUCCESS
);

const updateTermsOfServiceFailure = genericRequestFailureAction(
  types.UPDATE_TERMS_FAILURE
);

export const actions = {
  createTermsOfServiceFailure,
  createTermsOfService,
  createTermsOfServiceSuccess,
  fetchTermsOfServiceList,
  fetchTermsOfServiceListSuccess,
  fetchTermsOfServiceListFailure,
  updateTermsOfService,
  updateTermsOfServiceFailure,
  updateTermsOfServiceSuccess,
};
