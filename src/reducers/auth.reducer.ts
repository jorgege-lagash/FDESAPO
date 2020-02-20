import { User } from 'src/types/response/User';
import { types } from '../actions/auth.action';
import { Action } from '../types/Action';

export interface UserInfo {
  id: string;
  malls: any[];
  userType: string;
  serverAuth: boolean;
  userId: number;
  iat: number;
  exp: number;
}

export interface TokenInfo {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

export interface SessionState {
  isAuthenticated: boolean;
  error?: any;
  tokenData: TokenInfo | null;
  isLoading: boolean;
  userData: UserInfo | null;
  currentUser: User | null;
}

export const initialState: SessionState = {
  error: null,
  isAuthenticated: false,
  isLoading: false,
  userData: null,
  tokenData: null,
  currentUser: null,
};

export default (state = initialState, action: Action): SessionState => {
  switch (action.type) {
    case types.LOGIN_REQUEST:
      return { ...state, isLoading: true, error: null };

    case types.LOGIN_SUCCESS:
      const { userData, tokenData } = action.payload;
      return {
        ...state,
        userData,
        tokenData,
        isAuthenticated: true,
        isLoading: false,
      };

    case types.LOGIN_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        isAuthenticated: false,
        isLoading: false,
        userData: null,
        tokenData: null,
      };
    case types.LOGOUT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case types.LOGOUT_SUCCESS:
      return {
        ...state,
        error: null,
        userData: null,
        tokenData: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case types.SET_USER:
      return {
        ...state,
        currentUser: action.payload.user,
      };

    default:
      return state;
  }
};
