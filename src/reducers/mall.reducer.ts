import { GenericEntitySuccessAction } from 'src/actions/action-utils';
import { types } from '../actions/mall.action';
import { Action } from '../types/Action';
import { BaseResourceState } from '../types/BaseResourceState';
import { intitializeBaseResource } from '../utils';
import {
  cleanLocalStateAfterLogout,
  createDefaultBaseResourceResponseState,
  createDefaultErrorState,
  createDefaultRequestState,
} from './reducer-utils';

export interface MallState extends BaseResourceState<number> {
  selectedMall?: number;
}

const initialState: MallState = {
  ...intitializeBaseResource(),
  selectedMall: undefined,
};

export default (state = initialState, action: Action): MallState => {
  switch (action.type) {
    case types.SELECT_MALL:
      return {
        ...state,
        selectedMall: action.payload.mallId,
      };
    case types.FETCH_MALL_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        list: action.payload.ids || [],
      };

    case types.UPDATE_MALL_SUCCESS:
    case types.CREATE_MALL_SUCCESS:
      return createDefaultBaseResourceResponseState(
        state,
        action as GenericEntitySuccessAction
      );

    case types.FETCH_MALL_LIST_REQUEST:
    case types.UPDATE_MALL_REQUEST:
    case types.CREATE_MALL_REQUEST:
      return createDefaultRequestState(state);

    case types.CREATE_MALL_FAILURE:
    case types.UPDATE_MALL_FAILURE:
    case types.FETCH_MALL_LIST_FAILURE:
      return createDefaultErrorState(state, action);

    default:
      return cleanLocalStateAfterLogout<MallState>(state, action, {
        ...initialState,
      });
  }
};
