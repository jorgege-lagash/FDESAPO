import { TokenInfo, UserInfo } from '../reducers/auth.reducer';
import { actions, types } from './auth.action';

describe('login actions', () => {
  test('login request is generated correctly', () => {
    const login = 'login';
    const pass = 'pass';
    const result = actions.login(login, pass, true);
    expect(result.type).toEqual(types.LOGIN_REQUEST);
    expect(result.payload).toBeDefined();
    expect(result.payload.email).toEqual(login);
    expect(result.payload.password).toEqual(pass);
  });

  test('login success is generated correctly', () => {
    const userData: UserInfo = {
      id: 'testId',
      userId: 1,
      iat: 1,
      exp: 1,
      malls: [],
      userType: 'user',
      serverAuth: true,
    };
    const tokenData: TokenInfo = {
      access_token: 'testAccessToken',
      token_type: 'testTokenType',
      expires_in: 36000,
      refresh_token: 'testRefreshToken',
    };

    const result = actions.loginSuccess(userData, tokenData);
    expect(result.type).toEqual(types.LOGIN_SUCCESS);
    expect(result.payload).toBeDefined();
    expect(result.payload.userData).toEqual(userData);
    expect(result.payload.tokenData).toEqual(tokenData);
  });

  test('login failure is generated correctly', () => {
    const error = 'error';
    const result = actions.loginFailure(error);
    expect(result.type).toEqual(types.LOGIN_FAILURE);
    expect(result.payload).toBeDefined();
    expect(result.payload.error).toEqual(error);
  });
});

describe('signup actions', () => {
  test('signup request is generated correctly', () => {
    const login = 'login';
    const pass = 'pass';
    const result = actions.signup(login, pass);
    expect(result.type).toEqual(types.SIGNUP_REQUEST);
    expect(result.payload).toBeDefined();
    expect(result.payload.email).toEqual(login);
    expect(result.payload.password).toEqual(pass);
  });

  test('signup success is generated correctly', () => {
    const login = 'login';
    const result = actions.signupSuccess(login);
    expect(result.type).toEqual(types.SIGNUP_SUCCESS);
    expect(result.payload).toBeDefined();
  });

  test('signup failure is generated correctly', () => {
    const error = 'error';
    const result = actions.signupFailure(error);
    expect(result.type).toEqual(types.SIGNUP_FAILURE);
    expect(result.payload).toBeDefined();
    expect(result.payload.error).toEqual(error);
  });
});

describe('logout actions', () => {
  test('logout request is generated correctly', () => {
    const result = actions.logout();
    expect(result.type).toEqual(types.LOGOUT_REQUEST);
    expect(result.payload).toBeUndefined();
  });

  test('logout success is generated correctly', () => {
    const result = actions.logoutSuccess();
    expect(result.type).toEqual(types.LOGOUT_SUCCESS);
    expect(result.payload).toBeUndefined();
  });
});
