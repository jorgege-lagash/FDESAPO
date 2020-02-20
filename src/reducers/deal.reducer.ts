import { GenericEntitySuccessAction } from 'src/actions/action-utils';
import { TypedLooseObject } from 'src/types/LooseObject';
import { types } from '../actions/deal.action';
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

export interface DealState extends BaseResourceState<number> {
  selectedDeal?: number;
  sucByMallId?: TypedLooseObject<string[]>;
}

const initialState: DealState = {
  ...intitializeBaseResource(),
  selectedDeal: undefined,
};

export default (state = initialState, action: Action): DealState => {
  switch (action.type) {
    case types.FETCH_LIST_SUCCESS:
    case types.FETCH_PAGED_LIST_SUCCESS:
      return createDefaultListResponseState(
        state,
        action as GenericEntitySuccessAction
      );
    case types.FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        list: unique([...state.list, ...action.payload.ids]),
      };
    case types.UPDATE_SUCCESS:
    case types.CREATE_SUCCESS:
      return createDefaultBaseResourceResponseState(
        state,
        action as GenericEntitySuccessAction
      );

    case types.FETCH_REQUEST:
    case types.FETCH_LIST_REQUEST:
    case types.FETCH_PAGED_LIST_REQUEST:
    case types.UPDATE_REQUEST:
    case types.CREATE_REQUEST:
      return createDefaultRequestState(state);

    case types.FETCH_FAILURE:
    case types.CREATE_FAILURE:
    case types.UPDATE_FAILURE:
    case types.FETCH_PAGED_LIST_FAILURE:
    case types.FETCH_LIST_FAILURE:
      return createDefaultErrorState(state, action);

    default:
      return cleanLocalStateAfterLogout<DealState>(state, action, {
        ...initialState,
      });
  }
};
