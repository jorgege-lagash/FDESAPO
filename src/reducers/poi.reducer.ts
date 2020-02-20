import { GenericEntitySuccessAction } from 'src/actions/action-utils';
import { TypedLooseObject } from 'src/types/LooseObject';
import { types } from '../actions/poi.action';
import { Action } from '../types/Action';
import { BaseResourceState } from '../types/BaseResourceState';
import { intitializeBaseResource, unique } from '../utils';
import {
  cleanLocalStateAfterLogout,
  createDefaultBaseResourceResponseState,
  createDefaultErrorState,
  createDefaultListResponseState,
  createDefaultRequestState,
} from './reducer-utils';

export interface PoiState extends BaseResourceState<number> {
  selectedPoi?: number;
  sucByMallId?: TypedLooseObject<string[]>;
}

const initialState: PoiState = {
  ...intitializeBaseResource(),
  selectedPoi: undefined,
};

export default (state = initialState, action: Action): PoiState => {
  switch (action.type) {
    case types.SELECT_POI:
      return {
        ...state,
        selectedPoi: action.payload.poiId,
      };
    case types.FETCH_POI_LIST_SUCCESS:
      return createDefaultListResponseState(
        state,
        action as GenericEntitySuccessAction
      );

    case types.UPDATE_POI_SUCCESS:
    case types.CREATE_POI_SUCCESS:
      return createDefaultBaseResourceResponseState(state, action);

    case types.FETCH_POI_LIST_REQUEST:
    case types.UPDATE_POI_REQUEST:
    case types.CREATE_POI_REQUEST:
      return createDefaultRequestState(state);

    case types.CREATE_POI_FAILURE:
    case types.UPDATE_POI_FAILURE:
    case types.FETCH_POI_LIST_FAILURE:
    case types.POI_RESOURCE_LINK_FAILED:
      return createDefaultErrorState(state, action);
    case types.ADD_SUC_CODES:
      const { codes, mallId } = action.payload;
      const sucByMallId = state.sucByMallId || {};

      return {
        ...state,
        sucByMallId: {
          ...sucByMallId,
          [mallId]: unique([...(sucByMallId[mallId] || []), ...codes]),
        },
      };

    default:
      return cleanLocalStateAfterLogout<PoiState>(state, action, {
        ...initialState,
      });
  }
};
