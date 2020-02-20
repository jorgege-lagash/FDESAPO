import { GenericEntitySuccessAction } from 'src/actions/action-utils';
import { types } from '../actions/terms-of-service.action';
import { Action } from '../types/Action';
import { BaseResourceState } from '../types/BaseResourceState';
import { intitializeBaseResource } from '../utils';
import {
  cleanLocalStateAfterLogout,
  createDefaultBaseResourceResponseState,
  createDefaultErrorState,
  createDefaultRequestState,
} from './reducer-utils';

export interface TermsOfServiceState extends BaseResourceState<number> {
  saved: boolean;
}
const initialState: TermsOfServiceState = {
  ...intitializeBaseResource(),
  saved: false,
};

export default (state = initialState, action: Action): TermsOfServiceState => {
  switch (action.type) {
    case types.FETCH_TERMS_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        list: action.payload.ids || [],
      };

    case types.UPDATE_TERMS_SUCCESS:
    case types.CREATE_TERMS_SUCCESS:
      return {
        ...createDefaultBaseResourceResponseState(
          state,
          action as GenericEntitySuccessAction
        ),
        saved: true,
      };

    case types.FETCH_TERMS_LIST_REQUEST:
    case types.UPDATE_TERMS_REQUEST:
    case types.CREATE_TERMS_REQUEST:
      return {
        ...createDefaultRequestState(state),
        saved: false,
      };

    case types.CREATE_TERMS_FAILURE:
    case types.UPDATE_TERMS_FAILURE:
    case types.FETCH_TERMS_LIST_FAILURE:
      return {
        ...createDefaultErrorState(state, action),
        saved: false,
      };

    default:
      return cleanLocalStateAfterLogout<TermsOfServiceState>(state, action, {
        ...initialState,
      });
  }
};
