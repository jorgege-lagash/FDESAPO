import { createStore } from 'redux';
import { initHistory } from 'src/store/history';
import { types } from '../actions/auth.action';
import { TokenInfo, UserInfo } from './auth.reducer';
import rootReducer from './index';

const store = createStore(rootReducer(initHistory()));

// Check that child reducers handle an action
describe('Child Reducers', () => {
  it('handles correctly specific actions', () => {
    const userData: UserInfo = {
      id: 'testId',
      userId: 1,
      iat: 1,
      exp: 1,
      malls: [],
      serverAuth: true,
      userType: 'a',
    };
    const tokenData: TokenInfo = {
      access_token: 'testAccessToken',
      token_type: 'testTokenType',
      expires_in: 36000,
      refresh_token: 'testRefreshToken',
    };
    const action = {
      payload: { userData, tokenData, permissions: [] },
      type: types.LOGIN_SUCCESS,
    };
    const action2 = {
      payload: { userData, tokenData },
      type: types.LOGIN_FAILURE,
    };

    store.dispatch(action);
    expect(store.getState()).toEqual(
      rootReducer(initHistory())(undefined, action)
    );

    store.dispatch(action2);
    expect(store.getState()).toEqual(
      rootReducer(initHistory())(undefined, action2)
    );
  });
});
