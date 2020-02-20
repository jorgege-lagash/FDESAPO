import { ApplicationState } from 'src/reducers';
import { initialHistory } from '../store/index';
import { configureStore } from '../store/store';
import {
  addQueryStringToURL,
  getQueryString,
  handleRequestResult,
} from './request';

describe('request helper functions', () => {
  test('getSessionHeadersObject function returns the correct object with Authorization and Content-Type', () => {
    const state = {
      session: {
        tokenData: {
          access_token: 'testAccessToken',
          token_type: 'testTokenType',
          expires_in: 36000,
          refresh_token: 'testRefreshToken',
        },
      },
    };

    const mockGetSessionHeadersObject = jest.fn(() => {
      const mockStore = state;
      return {
        Authorization: mockStore.session.tokenData,
        // tslint:disable-next-line:no-duplicate-string
        'Content-Type': 'application/json',
      };
    });

    const headers = mockGetSessionHeadersObject();
    const result = {
      Authorization: state.session.tokenData,
      'Content-Type': 'application/json',
    };

    expect(headers).toEqual(result);
  });

  test('getQueryString function encodes correctly URI components', () => {
    const mockQueries = {
      firstQuery: 'https://test.com/index.php?name=test&lastname=test',
      secondQuery: 'http://test.com/index.php?age=test&email=test',
    };

    const result =
      'firstQuery=https%3A%2F%2Ftest.com%2Findex.php%3Fname%3Dtest%26lastname%3Dtest&secondQuery=http%3A%2F%2Ftest.com%2Findex.php%3Fage%3Dtest%26email%3Dtest';

    expect(getQueryString(mockQueries)).toEqual(result);
  });

  test('addQueryStringToURL function adds queries correctly to the URL', () => {
    const baseURL = 'https://apiary-mock.com/';
    const query = 'users';
    const filters = {
      user1: 'name1',
      user2: 'name2',
    };
    const result =
      'https://apiary-mock.com/?0=u&1=s&2=e&3=r&4=s&filter=%7B%22user1%22%3A%22name1%22%2C%22user2%22%3A%22name2%22%7D';
    expect(addQueryStringToURL(baseURL, query, filters)).toEqual(result);
  });
});

describe('handleRequestResult', () => {
  const initialState = {
    session: {
      error: null,
      isAuthenticated: true,
      isLoading: false,
      tokenData: {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ2ODg5OWY4LTBmY2EtNGIwYy1iZjI4LTdhYWEzY2QyMWFiZCIsIm1hbGxzIjpbeyJpZCI6MX0seyJpZCI6MTh9LHsiaWQiOjE5fSx7ImlkIjoyMH0seyJpZCI6MjF9LHsiaWQiOjIyfSx7ImlkIjoyM30seyJpZCI6MjR9LHsiaWQiOjI1fSx7ImlkIjoyNn0seyJpZCI6Mjd9LHsiaWQiOjI4fSx7ImlkIjoyOX0seyJpZCI6MzB9LHsiaWQiOjMxfSx7ImlkIjozMn0seyJpZCI6MzN9LHsiaWQiOjM0fSx7ImlkIjozNX0seyJpZCI6MzZ9LHsiaWQiOjM3fSx7ImlkIjozOH0seyJpZCI6Mzl9LHsiaWQiOjQwfSx7ImlkIjo0MX0seyJpZCI6NDJ9XSwidXNlcm5hbWUiOiJzdXBlcmFkbWluIiwiZW1haWwiOiJzdXBlcmFkbWluQGVtYWlsLmNvbSIsInJvbGVzIjpbImFkbWluIiwiYWRtaW4iLCJhZG1pbiIsImFkbWluIiwiYWRtaW4iLCJhZG1pbiIsImFkbWluIiwiYWRtaW4iLCJhZG1pbiIsImFkbWluIiwiYWRtaW4iLCJhZG1pbiIsImFkbWluIiwiYWRtaW4iLCJhZG1pbiIsImFkbWluIiwiYWRtaW4iLCJhZG1pbiIsImFkbWluIiwiYWRtaW4iLCJhZG1pbiIsImFkbWluIiwiYWRtaW4iLCJhZG1pbiIsImFkbWluIiwiYWRtaW4iXSwidXNlcklkIjoxLCJ1c2VyVHlwZSI6InVzZXIiLCJzZXJ2ZXJBdXRoIjp0cnVlLCJpYXQiOjE1NDQ0NjQzNjQsImV4cCI6MTU0NDQ2Nzk2NH0.iDJGLD0XWVboxtUkRzbCBlQX8qbZGlU2jBYHy87RWc0',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBiMjk1MmJhLTFlMzctNDUwMC1iNzc1LWY0ODc0MGI3MWM0ZSIsImFjY2Vzc1Rva2VuSWQiOiJkNjg4OTlmOC0wZmNhLTRiMGMtYmYyOC03YWFhM2NkMjFhYmQiLCJ1c2VySWQiOjEsInVzZXJUeXBlIjoidXNlciIsImlhdCI6MTU0NDQ2NDM2NCwiZXhwIjoxNTQ0NDcxNTY0fQ.kYgjEGvBrtk4wWZ7QhYvXRQvk00zUML0fCJnj45pIyc',
      },
    },
  };
  it('executes refresh token flow correctly', async () => {
    (fetch as any).resetMocks();
    expect.assertions(2);
    const url = 'www.testurl.com';
    const finalResponseName = 'final get response';
    (fetch as any).mockResponses(
      [JSON.stringify({ name: 'initial get response' }), { status: 401 }],
      // refresh token response
      [
        JSON.stringify({
          access_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYyZDYwYjY5LTk1YjgtNDdhZS04OGNkLWY0MGQ3OGYwZmM0MiIsIm1hbGxzIjpbeyJpZCI6MX0seyJpZCI6MTh9LHsiaWQiOjE5fSx7ImlkIjoyMH0seyJpZCI6MjF9LHsiaWQiOjIyfSx7ImlkIjoyM30seyJpZCI6MjR9LHsiaWQiOjI1fSx7ImlkIjoyNn0seyJpZCI6Mjd9LHsiaWQiOjI4fSx7ImlkIjoyOX0seyJpZCI6MzB9LHsiaWQiOjMxfSx7ImlkIjozMn0seyJpZCI6MzN9LHsiaWQiOjM0fSx7ImlkIjozNX0seyJpZCI6MzZ9LHsiaWQiOjM3fSx7ImlkIjozOH0seyJpZCI6Mzl9LHsiaWQiOjQwfSx7ImlkIjo0MX0seyJpZCI6NDJ9XSwidXNlcm5hbWUiOiJzdXBlcmFkbWluIiwiZW1haWwiOiJzdXBlcmFkbWluQGVtYWlsLmNvbSIsInJvbGVzIjpbImFkbWluIiwiYWRtaW4iLCJhZG1pbiIsImFkbWluIiwiYWRtaW4iLCJhZG1pbiIsImFkbWluIiwiYWRtaW4iLCJhZG1pbiIsImFkbWluIiwiYWRtaW4iLCJhZG1pbiIsImFkbWluIiwiYWRtaW4iLCJhZG1pbiIsImFkbWluIiwiYWRtaW4iLCJhZG1pbiIsImFkbWluIiwiYWRtaW4iLCJhZG1pbiIsImFkbWluIiwiYWRtaW4iLCJhZG1pbiIsImFkbWluIiwiYWRtaW4iXSwidXNlcklkIjoxLCJ1c2VyVHlwZSI6InVzZXIiLCJzZXJ2ZXJBdXRoIjp0cnVlLCJpYXQiOjE1NDQ0NjUyNzIsImV4cCI6MTU0NDQ2ODg3Mn0.vcW31ip3HRMArO9q7txFTl4kCSIroo9KoAcf_urUyfg',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNGJiMmFhLTQ1YmMtNDcyNy1hMjA2LTJmYTI3ODIxYzk5NyIsImFjY2Vzc1Rva2VuSWQiOiJmMmQ2MGI2OS05NWI4LTQ3YWUtODhjZC1mNDBkNzhmMGZjNDIiLCJ1c2VySWQiOjEsInVzZXJUeXBlIjoidXNlciIsImlhdCI6MTU0NDQ2NTI3MiwiZXhwIjoxNTQ0NDcyNDcyfQ.czQubBRT8L49WfR_4Kp8uiVqi0xWMWIRrt9JX5TdQgg',
        }),
        { status: 200 },
      ],
      [JSON.stringify({ name: finalResponseName }), { status: 200 }]
    );
    const store = configureStore(
      initialHistory,
      initialState as ApplicationState
    );
    const myHeaders = new Headers({
      'Content-Type': 'application/json',
    });
    const settings: RequestInit = {
      body: JSON.stringify({}),
      headers: myHeaders,
      method: 'GET',
      mode: 'cors',
    };
    const response = await fetch(url, settings);
    const handleRequest = handleRequestResult(url, settings, store);
    let requestResponse;
    try {
      requestResponse = await handleRequest(response);
    } catch (error) {
      expect(error).toBeFalsy();
    }

    const finalState = store.getState();
    expect(finalState.session.isAuthenticated).toBe(true);
    expect(requestResponse.name).toBe(finalResponseName);
  });

  it('throws error and logout when unable to refresh token', async () => {
    expect.assertions(3);
    const url = 'www.testurl.com';
    const finalResponseName = 'final get response';
    (fetch as any).mockResponses(
      [JSON.stringify({ name: 'initial get response' }), { status: 401 }],
      // refresh token response
      [
        JSON.stringify({
          access_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYyZDYwYjY5LTk1YjgtNDdhZS04OGNkLWY0MGQ3OGYwZmM0MiIsIm1hbGxzIjpbeyJpZCI6MX0seyJpZCI6MTh9LHsiaWQiOjE5fSx7ImlkIjoyMH0seyJpZCI6MjF9LHsiaWQiOjIyfSx7ImlkIjoyM30seyJpZCI6MjR9LHsiaWQiOjI1fSx7ImlkIjoyNn0seyJpZCI6Mjd9LHsiaWQiOjI4fSx7ImlkIjoyOX0seyJpZCI6MzB9LHsiaWQiOjMxfSx7ImlkIjozMn0seyJpZCI6MzN9LHsiaWQiOjM0fSx7ImlkIjozNX0seyJpZCI6MzZ9LHsiaWQiOjM3fSx7ImlkIjozOH0seyJpZCI6Mzl9LHsiaWQiOjQwfSx7ImlkIjo0MX0seyJpZCI6NDJ9XSwidXNlcm5hbWUiOiJzdXBlcmFkbWluIiwiZW1haWwiOiJzdXBlcmFkbWluQGVtYWlsLmNvbSIsInJvbGVzIjpbImFkbWluIiwiYWRtaW4iLCJhZG1pbiIsImFkbWluIiwiYWRtaW4iLCJhZG1pbiIsImFkbWluIiwiYWRtaW4iLCJhZG1pbiIsImFkbWluIiwiYWRtaW4iLCJhZG1pbiIsImFkbWluIiwiYWRtaW4iLCJhZG1pbiIsImFkbWluIiwiYWRtaW4iLCJhZG1pbiIsImFkbWluIiwiYWRtaW4iLCJhZG1pbiIsImFkbWluIiwiYWRtaW4iLCJhZG1pbiIsImFkbWluIiwiYWRtaW4iXSwidXNlcklkIjoxLCJ1c2VyVHlwZSI6InVzZXIiLCJzZXJ2ZXJBdXRoIjp0cnVlLCJpYXQiOjE1NDQ0NjUyNzIsImV4cCI6MTU0NDQ2ODg3Mn0.vcW31ip3HRMArO9q7txFTl4kCSIroo9KoAcf_urUyfg',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNGJiMmFhLTQ1YmMtNDcyNy1hMjA2LTJmYTI3ODIxYzk5NyIsImFjY2Vzc1Rva2VuSWQiOiJmMmQ2MGI2OS05NWI4LTQ3YWUtODhjZC1mNDBkNzhmMGZjNDIiLCJ1c2VySWQiOjEsInVzZXJUeXBlIjoidXNlciIsImlhdCI6MTU0NDQ2NTI3MiwiZXhwIjoxNTQ0NDcyNDcyfQ.czQubBRT8L49WfR_4Kp8uiVqi0xWMWIRrt9JX5TdQgg',
        }),
        { status: 401 },
      ],
      [JSON.stringify({ name: finalResponseName }), { status: 401 }]
    );
    const store = configureStore(
      initialHistory,
      initialState as ApplicationState
    );
    const myHeaders = new Headers({
      'Content-Type': 'application/json',
    });
    const settings: RequestInit = {
      body: JSON.stringify({}),
      headers: myHeaders,
      method: 'GET',
      mode: 'cors',
    };
    const response = await fetch(url, settings);
    const handleRequest = handleRequestResult(url, settings, store);
    try {
      await handleRequest(response);
    } catch (error) {
      expect(error).toBeTruthy();
      expect(error.statusCode).toBe(401);
    }

    const finalState = store.getState();
    expect(finalState.session.isAuthenticated).toBe(false);
  });
});
