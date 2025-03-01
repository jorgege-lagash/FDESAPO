import { Mall } from '../Mall';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  malls: Mall[];
}
