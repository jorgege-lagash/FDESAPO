import { call, put } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { UserInfo } from 'src/reducers/auth.reducer';
import { User } from 'src/types/response/User';
import { actions } from '../actions/auth.action';
import * as api from '../api';
import { login, logout } from './auth.sagas';

describe('login saga flow', () => {
  const user = 'testuser';
  // tslint:disable-next-line:no-hardcoded-credentials
  const password = 'testpassword';
  const generator = cloneableGenerator(login)(
    actions.login(user, password, false)
  );
  const expectedUserData: UserInfo = {
    id: 'e55b7ac4-438e-459b-8b81-d836de6eed1b',
    malls: [
      {
        id: 1,
      },
      {
        id: 18,
      },
      {
        id: 50,
      },
      {
        id: 51,
      },
      {
        id: 52,
      },
      {
        id: 53,
      },
      {
        id: 54,
      },
    ],
    userId: 1,
    userType: 'user',
    serverAuth: true,
    iat: 1550849823,
    exp: 1550853423,
  };
  const mockTokenData = {
    access_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1NWI3YWM0LTQzOGUtNDU5Yi04YjgxLWQ4MzZkZTZlZWQxYiIsIm1hbGxzIjpbeyJpZCI6MX0seyJpZCI6MTh9LHsiaWQiOjUwfSx7ImlkIjo1MX0seyJpZCI6NTJ9LHsiaWQiOjUzfSx7ImlkIjo1NH1dLCJ1c2VySWQiOjEsInVzZXJUeXBlIjoidXNlciIsInNlcnZlckF1dGgiOnRydWUsImlhdCI6MTU1MDg0OTgyMywiZXhwIjoxNTUwODUzNDIzfQ==.URz6D6jubIPW46NgU9BKhHzMhdNCvlvgSfvl3p7aTAg',
    token_type: 'bearer',
    expires_in: 3600,
    refresh_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI4N2RhMzIwLTkzYmItNGI2Zi1hYTFiLTcxNGE5MjlmMzdlYiIsImFjY2Vzc1Rva2VuSWQiOiJlNTViN2FjNC00MzhlLTQ1OWItOGI4MS1kODM2ZGU2ZWVkMWIiLCJ1c2VySWQiOjEsInVzZXJUeXBlIjoidXNlciIsImlhdCI6MTU1MDg0OTgyMywiZXhwIjoxNTUwODU3MDIzfQ.b0vDvrEYfSAbSMqZVIfXGGpuZ0qDCDLYgCKn9dtCYfo',
    malls: [
      {
        id: 1,
        name: 'Parque Arauco',
        description: null,
        identificator: 'PAC',
        created: '2018-10-23T23:30:28.756Z',
        modified: '2018-10-23T23:30:28.756Z',
      },
    ],
  };
  test("call's login method with correct parameters", () => {
    expect(generator.next().value).toEqual(call(api.login, user, password));
  });
  test("call's login action with correct payload.", () => {
    const clone = generator.clone();
    const { malls, ...token } = mockTokenData;

    expect(clone.next({ ...mockTokenData, malls: [] }).value).toEqual(
      put(actions.loginSuccess(expectedUserData, token))
    );
    expect(clone.next().value).toEqual(call(api.fetchCurrentUser));
    const userData: User = {
      id: 1,
      username: 'superadmin',
      email: 'superadmin@email.com',
      firstName: 'string',
      lastName: 'string',
    };
    expect(clone.next(userData).value).toEqual(put(actions.setUser(userData)));
  });

  test('Should put login failure on error', () => {
    const clone = generator.clone();
    if (clone.throw) {
      const error = 'error';
      expect(clone.throw(error).value).toEqual(
        put(actions.loginFailure(error))
      );
      expect(clone.next().done).toEqual(true);
    }
  });
});

describe('logout saga flow', () => {
  const generator = cloneableGenerator(logout)();
  test("call's api's logout method with correct payload", () => {
    expect(generator.next().value).toEqual(call(api.logout));
  });
  test("call's logout success action with correct payload", () => {
    expect(generator.next().value).toEqual(put(actions.logoutSuccess()));
  });
});
