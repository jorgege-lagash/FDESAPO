import { types } from '../actions/maas.action';
import { Action } from '../types/Action';
import { BaseResourceState } from '../types/BaseResourceState';
import { intitializeBaseResource } from '../utils';
import {
  cleanLocalStateAfterLogout,
  createDefaultErrorState,
  createDefaultRequestState,
} from './reducer-utils';

export type PwPoiState = BaseResourceState<number>;
const initialState: PwPoiState = intitializeBaseResource();

export default (state = initialState, action: Action): PwPoiState => {
  switch (action.type) {
    case types.FETCH_PWPOI_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        list: action.payload.ids || [],
      };

    case types.FETCH_PWPOI_LIST_REQUEST:
      return createDefaultRequestState(state);

    case types.FETCH_PWPOI_LIST_FAILURE:
      return createDefaultErrorState(state, action);

    default:
      return cleanLocalStateAfterLogout<PwPoiState>(state, action, {
        ...initialState,
      });
  }
};
