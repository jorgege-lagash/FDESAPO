import { types } from '../actions/time-zones.action';
import { Action } from '../types/Action';
import { cleanLocalStateAfterLogout } from './reducer-utils';

export interface TimeZoneState {
  list: string[];
  total: number;
  isLoading: boolean;
  saved: boolean;
  error?: any;
}

const initialState: TimeZoneState = {
  list: [],
  total: 0,
  isLoading: false,
  saved: false,
};

export default (state = initialState, action: Action): TimeZoneState => {
  switch (action.type) {
    case types.FETCH_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        saved: true,
        list: action.payload.list || [],
        total: action.payload.total,
      };
    case types.FETCH_LIST_REQUEST:
      return {
        ...(state as any),
        saved: false,
        isLoading: true,
        error: null,
      };

    case types.FETCH_LIST_FAILURE:
      const { error } = action.payload;
      return {
        ...(state as any),
        saved: false,
        isLoading: false,
        error,
      };

    default:
      return cleanLocalStateAfterLogout<TimeZoneState>(state, action, {
        ...initialState,
      });
  }
};
