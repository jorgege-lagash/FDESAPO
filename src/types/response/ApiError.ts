import { TypedLooseObject } from '../LooseObject';

export interface ApiError {
  message?: string;
  statusCode: number;
  error?: string;
  details?: ApiErrorDetail[];
}

export interface ApiErrorDetail {
  target: any;
  value: string;
  property: string;
  children: any[];
  constraints: TypedLooseObject<string>;
}
