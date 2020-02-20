import {
  CreateZoneRequestAction,
  UpdateZoneRequestAction,
  ZoneListRequestAction,
  ZoneRequestAction,
} from '../types/action/ZoneActions';
import { Zone } from '../types/response/Zone';
import {
  genericEntitySuccessAction,
  genericRequestFailureAction,
} from './action-utils';

export const types = {
  CREATE_ZONE_FAILURE: 'ZONE/CREATE_ZONE_FAILURE',
  CREATE_ZONE_REQUEST: 'ZONE/CREATE_ZONE_REQUEST',
  CREATE_ZONE_SUCCESS: 'ZONE/CREATE_ZONE_SUCCESS',
  FETCH_ZONE_FAILURE: 'ZONE/FETCH_ZONE_FAILURE',
  FETCH_ZONE_LIST_FAILURE: 'ZONE/FETCH_ZONE_LIST_FAILURE',
  FETCH_ZONE_LIST_REQUEST: 'ZONE/FETCH_ZONE_LIST_REQUEST',
  FETCH_ZONE_LIST_SUCCESS: 'ZONE/FETCH_ZONE_LIST_SUCCESS',
  FETCH_ZONE_REQUEST: 'ZONE/FETCH_ZONE_REQUEST',
  FETCH_ZONE_SUCCESS: 'ZONE/FETCH_ZONE_SUCCESS',
  UPDATE_ZONE_FAILURE: 'ZONE/UPDATE_ZONE_FAILURE',
  UPDATE_ZONE_REQUEST: 'ZONE/UPDATE_ZONE_REQUEST',
  UPDATE_ZONE_SUCCESS: 'ZONE/UPDATE_ZONE_SUCCESS',
};

const createZone = (mallId: number, zone: Zone): CreateZoneRequestAction => {
  return {
    type: types.CREATE_ZONE_REQUEST,
    payload: {
      mallId,
      zone,
    },
  };
};

const createZoneSuccess = genericEntitySuccessAction(types.CREATE_ZONE_SUCCESS);

const createZoneFailure = genericRequestFailureAction(
  types.CREATE_ZONE_FAILURE
);

const fetchZoneList = (mallId: number): ZoneListRequestAction => {
  return {
    type: types.FETCH_ZONE_LIST_REQUEST,
    payload: { mallId },
  };
};

const fetchZoneListSuccess = genericEntitySuccessAction(
  types.FETCH_ZONE_LIST_SUCCESS
);

const fetchZoneListFailure = genericRequestFailureAction(
  types.FETCH_ZONE_LIST_SUCCESS
);

const fetchZone = (mallId: number, zoneId: number): ZoneRequestAction => {
  return {
    type: types.FETCH_ZONE_REQUEST,
    payload: { mallId, zoneId },
  };
};

const fetchZoneSuccess = genericEntitySuccessAction(types.FETCH_ZONE_SUCCESS);

const fetchZoneFailure = genericRequestFailureAction(types.FETCH_ZONE_SUCCESS);

const updateZone = (
  mallId: number,
  zoneId: number,
  zone: Partial<Zone>
): UpdateZoneRequestAction => {
  return {
    type: types.UPDATE_ZONE_REQUEST,
    payload: {
      mallId,
      zoneId,
      zone,
    },
  };
};

const updateZoneSuccess = genericEntitySuccessAction(types.UPDATE_ZONE_SUCCESS);

const updateZoneFailure = genericRequestFailureAction(
  types.UPDATE_ZONE_FAILURE
);

export const actions = {
  createZone,
  createZoneFailure,
  createZoneSuccess,
  fetchZone,
  fetchZoneFailure,
  fetchZoneList,
  fetchZoneListFailure,
  fetchZoneListSuccess,
  fetchZoneSuccess,
  updateZone,
  updateZoneFailure,
  updateZoneSuccess,
};
