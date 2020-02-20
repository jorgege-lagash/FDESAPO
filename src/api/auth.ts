import { User } from 'src/types/response/User';
import { LoginResponse } from '../types/response/LoginResponse';
import { HttpService } from '../utils/request';

export const login = (user: string, password: string) => {
  const requestBody = {
    grant_type: 'password',
    password,
    user_type: 'user',
    username: user,
  };
  return HttpService.post<LoginResponse>('auth/token', requestBody, {});
};

export const logout = () => {
  return HttpService.post('auth/logout', {}, {});
};

export const fetchCurrentUser = () => {
  return HttpService.get<User>('users/me', {});
};
