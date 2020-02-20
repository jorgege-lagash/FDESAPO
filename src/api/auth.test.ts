import { login } from './auth';
it('fetch logins Through User', async () => {
  expect.assertions(2);
  const loginData = {
    grant_type: 'password',
    // tslint:disable-next-line:no-hardcoded-credentials
    password: 'abc123',
    user_type: 'user',
    username: 'abc123',
  };
  (fetch as any).resetMocks();
  (fetch as any).mockResponses([JSON.stringify(loginData), { status: 200 }]);

  try {
    const response = await login('user', 'mockpassword');
    expect(response).toBeTruthy();
    expect(response).toEqual(loginData);
  } catch (error) {
    expect(error).toBeFalsy();
  }
});
