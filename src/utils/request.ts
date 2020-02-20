import { get } from 'lodash';
import { Store } from 'redux';
import { UserInfo } from 'src/reducers/auth.reducer';
import { actions } from '../actions/auth.action';
import { ApplicationState } from '../reducers';
import store from '../store/index';
import { LooseObject, TypedLooseObject } from '../types/LooseObject';
import { APPCONFIG } from 'src/constants/config';

export interface CustomHeaders extends TypedLooseObject<string | undefined> {
  // tslint:disable-next-line:no-duplicate-string
  'Content-Type'?: string;
  'a-mall-id'?: string;
  'accept-language'?: string;
}

export interface CustomRequestOptions {
  query?: LooseObject;
  filter?: LooseObject;
}

export interface ResponseErrorData {
  statusCode: number;
  statusText?: string;
  message?: string;
}

export enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}
export interface TokenData {
  access_token: string;
  refresh_token: string;
}

const { logout } = actions;
const baseURL : string = `${APPCONFIG.env.apiHost}`;
// tslint:disable-next-line:no-console
// tslint:disable-next-line:no-console

export const methods = {
  DELETE: 'DELETE',
  GET: 'GET',
  PATCH: 'PATCH',
  POST: 'POST',
  PUT: 'PUT',
};

export const addMallHeader = (mallId: number, initialHeaders: any = {}) => ({
  ...initialHeaders,
  'a-mall-id': mallId,
});

export const getSessionHeadersObject = (
  rStore: Store<ApplicationState>
): any => {
  const state: ApplicationState = rStore.getState();
  const storageToken = getAccessToken();
  const headers = {
    Authorization: storageToken && `Bearer ${storageToken}`,
    // tslint:disable-next-line:no-duplicate-string
    'Content-Type': 'application/json',
    'a-mall-id': '1',
    'accept-language': get(state, 'locale.lang', 'es'),
  };
  if (!headers.Authorization) {
    delete headers.Authorization;
  }
  return headers;
};
const refreshTokenRequest = (rStore: Store<ApplicationState>) => {
  const settings: RequestInit = {
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: getRefreshToken(),
    }),
    headers: {
      // tslint:disable-next-line:no-duplicate-string
      'Content-Type': 'application/json',
    },
    method: 'POST',
    mode: 'cors',
  };
  return fetch(`${baseURL}auth/token`, settings);
};
const handleRefreshTokenFlow = async (
  url: string,
  options: any,
  rStore: Store<ApplicationState>
) => {
  const refreshResponse = await refreshTokenRequest(rStore);
  if (refreshResponse.status === 200) {
    const refreshToken = await refreshResponse.json();
    const { malls, ...tokenData } = refreshToken;
    setTokenData(tokenData);
    const userData: UserInfo = JSON.parse(
      atob(refreshToken.access_token.split('.')[1])
    );
    rStore.dispatch(actions.loginSuccess(userData, tokenData));
    const state = rStore.getState();
    const newToken = state.session.tokenData
      ? `Bearer ${state.session.tokenData.access_token}`
      : '';
    (options.headers as Headers).set('Authorization', newToken);
    return await fetch(url, options);
  } else {
    rStore.dispatch(logout());
    throw new Error('invalid refresh_token');
  }
};
export const handleRequestResult = (
  url: string,
  options: any,
  rStore: Store<ApplicationState>
) => async (response: Response) => {
  let isError = false;
  const session = rStore.getState().session;
  let requestResponse = response;
  if (session.isAuthenticated && requestResponse.status === 401) {
    try {
      requestResponse = await handleRefreshTokenFlow(url, options, rStore);
    } catch (e) {
      isError = true;
    }
  }
  if (requestResponse.status >= 400 && requestResponse.status < 600) {
    isError = true;
  }
  let data: any = {};
  try {
    data = await requestResponse.json();
    if (!isError) {
      return data;
    }
  } catch (e) {
    if (!isError) {
      return null;
    }
  }
  throw {
    message: data.message || '',
    statusCode: response.status,
    statusText: response.statusText,
    details: data.details,
  } as ResponseErrorData;
};

export const getQueryString = (params = {}) => {
  return Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== null)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');
};

export const addQueryStringToURL = (url: string, query: any, filter: any) => {
  const parameters = [];
  let resultQueryString = '';
  const queryParameters = getQueryString(query);
  if (queryParameters.length > 0) {
    parameters.push(queryParameters);
  }
  let filterParameters = '';
  if (filter) {
    filterParameters = `filter=${encodeURIComponent(JSON.stringify(filter))}`;
    parameters.push(filterParameters);
  }
  if (parameters.length > 0) {
    resultQueryString = `?${parameters.join('&')}`;
  }
  return `${url}${resultQueryString}`;
};

export const request = (
  url: string,
  method: HttpMethods,
  headers: any,
  data: any,
  options: CustomRequestOptions = {}
) => {
  const requestURL = addQueryStringToURL(url, options.query, options.filter);
  let myHeaders = null;

  if (headers) {
    myHeaders = new Headers(headers);
  } else {
    myHeaders = new Headers({
      'Content-Type': 'application/json',
    });
  }
  const settings: RequestInit = {
    body: data ? JSON.stringify(data) : data,
    headers: myHeaders,
    method,
    mode: 'cors',
  };

  const finalUrl = `${baseURL}${requestURL}`;
  return fetch(finalUrl, settings).then(
    handleRequestResult(finalUrl, settings, store)
  );
};

const fileUploadRequest = (requestURL: string, file: File, name: string) => {
  const formData = new FormData();
  formData.append('file', file, name);
  const headers = new Headers(getSessionHeadersObject(store));
  headers.delete('Content-Type');
  const settings = {
    body: formData,
    headers,
    method: HttpMethods.POST,
  };

  const finalUrl = `${baseURL}${requestURL}`;
  return fetch(finalUrl, settings).then(
    handleRequestResult(finalUrl, settings, store)
  );
};

function buildRequest<T>(
  url: string,
  method: HttpMethods,
  headers: any = {},
  data: any,
  options: any = {}
): Promise<T> {
  // tslint:disable-next-line:no-console
  console.log(baseURL);
  const headerObject = { ...getSessionHeadersObject(store), ...headers };
  return request(url, method, headerObject, data, options);
}

export const HttpService = {
  get<T>(url: string, options: any, customHeaders: any = {}) {
    return buildRequest<T>(url, HttpMethods.GET, customHeaders, null, options);
  },

  post<T>(url: string, data: any, options: any, customHeaders: any = {}) {
    return buildRequest<T>(url, HttpMethods.POST, customHeaders, data, options);
  },

  put<T>(url: string, data: any, options: any, customHeaders: any = {}) {
    return buildRequest<T>(url, HttpMethods.PUT, customHeaders, data, options);
  },

  patch<T>(url: string, data: any, options: any, customHeaders: any = {}) {
    return buildRequest<T>(
      url,
      HttpMethods.PATCH,
      customHeaders,
      data,
      options
    );
  },

  delete(url: string, data: any, options: any, customHeaders: any = {}) {
    return buildRequest(url, HttpMethods.DELETE, customHeaders, data, options);
  },

  uploadFile(url: string, file: File, fileName: string) {
    return fileUploadRequest(url, file, fileName || file.name);
  },
};

const getAccessToken = () => {
  return localStorage.getItem('access_token');
};
const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

export const setTokenData = (tokenData: TokenData) => {
  localStorage.setItem('sessionData', JSON.stringify(tokenData));
  localStorage.setItem('access_token', tokenData.access_token);
  localStorage.setItem('refresh_token', tokenData.refresh_token);
};

export default request;
