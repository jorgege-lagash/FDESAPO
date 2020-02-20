import { GenericEntitySuccessAction } from 'src/actions/action-utils';
import { types } from '../actions/zone.action';
import { Action } from '../types/Action';
import { BaseResourceState } from '../types/BaseResourceState';
import { intitializeBaseResource, unique } from '../utils';
import {
  cleanLocalStateAfterLogout,
  createDefaultBaseResourceResponseState,
  createDefaultErrorState,
  createDefaultRequestState,
} from './reducer-utils';

export type ZoneState = BaseResourceState<number>;
const initialState: ZoneState = intitializeBaseResource();

export default (state = initialState, action: Action): ZoneState => {
  switch (action.type) {
    case types.FETCH_ZONE_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        list: action.payload.ids || [],
      };
    case types.FETCH_ZONE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        list: unique([...state.list, ...action.payload.ids]),
      };
    case types.UPDATE_ZONE_SUCCESS:
    case types.CREATE_ZONE_SUCCESS:
      return createDefaultBaseResourceResponseState(
        state,
        action as GenericEntitySuccessAction
      );

    case types.FETCH_ZONE_REQUEST:
    case types.FETCH_ZONE_LIST_REQUEST:
    case types.UPDATE_ZONE_REQUEST:
    case types.CREATE_ZONE_REQUEST:
      return createDefaultRequestState(state);

    case types.FETCH_ZONE_FAILURE:
    case types.CREATE_ZONE_FAILURE:
    case types.UPDATE_ZONE_FAILURE:
    case types.FETCH_ZONE_LIST_FAILURE:
      return createDefaultErrorState(state, action);

    default:
      return cleanLocalStateAfterLogout<ZoneState>(state, action, {
        ...initialState,
      });
  }
};
