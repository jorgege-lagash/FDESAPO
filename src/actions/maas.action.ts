import { Action } from 'src/types/Action';
import { PwBuildingDTO } from 'src/types/response/PwBuilding';
import {
  genericEntitySuccessAction,
  genericRequestFailureAction,
} from './action-utils';

export const types = {
  FETCH_PWPOI_LIST_FAILURE: 'PWPOI/FETCH_LIST_FAILURE',
  FETCH_PWPOI_LIST_REQUEST: 'PWPOI/FETCH_LIST_REQUEST',
  FETCH_PWPOI_LIST_SUCCESS: 'PWPOI/FETCH_LIST_SUCCESS',
  FETCH_PW_BUILDING_FAILURE: 'PW_BUILDING/FETCH_FAILURE',
  FETCH_PW_BUILDING_REQUEST: 'PW_BUILDING/FETCH_REQUEST',
  FETCH_PW_BUILDING_SUCCESS: 'PW_BUILDING/FETCH_SUCCESS',
};
export interface PwPoiListRequestAction extends Action {
  payload: { mallId: number };
}

const fetchPwPoiList = (mallId: number): PwPoiListRequestAction => ({
  type: types.FETCH_PWPOI_LIST_REQUEST,
  payload: { mallId },
});

const fetchPwPoiListSuccess = genericEntitySuccessAction(
  types.FETCH_PWPOI_LIST_SUCCESS
);

const fetchPwPoiListFailure = genericRequestFailureAction(
  types.FETCH_PWPOI_LIST_SUCCESS
);

export interface PwBuildingRequestAction extends Action {
  payload: { mallId: number };
}

const fetchPwBuilding = (mallId: number): PwBuildingRequestAction => ({
  type: types.FETCH_PW_BUILDING_REQUEST,
  payload: { mallId },
});

export interface PwBuildingRequestSuccessAction extends Action {
  payload: { building: PwBuildingDTO };
}

const fetchPwBuildingSuccess = genericEntitySuccessAction(
  types.FETCH_PW_BUILDING_SUCCESS
);

const fetchPwBuildingFailure = genericRequestFailureAction(
  types.FETCH_PW_BUILDING_FAILURE
);

export const actions = {
  fetchPwPoiList,
  fetchPwPoiListSuccess,
  fetchPwPoiListFailure,
  fetchPwBuilding,
  fetchPwBuildingSuccess,
  fetchPwBuildingFailure,
};
