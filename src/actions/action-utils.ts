import { Language } from 'src/types/lang';
import { Action } from '../types/Action';

export interface GenericEntitySuccessAction extends Action {
  payload: {
    ids: number[];
    entities: any;
    total: number;
    page: number;
    pageSize: number;
    language?: Language;
  };
}

export type GenericEntitySuccessActionCreator = (
  ids: number[],
  entities: any,
  total?: number,
  page?: number,
  pageSize?: number,
  language?: Language
) => GenericEntitySuccessAction;

export const genericEntitySuccessAction = (
  type: string
): GenericEntitySuccessActionCreator => (
  ids: number[],
  entities: any,
  total: number = 0,
  page: number = 1,
  pageSize: number = 10,
  language?: Language
): GenericEntitySuccessAction => {
  return {
    type,
    payload: {
      ids,
      entities,
      total,
      page,
      pageSize,
      language,
    },
  };
};

export interface GenericRequestFailureAction extends Action {
  payload: {
    error: any;
  };
}

export type GenericRequestFailureActionCreator = (
  error?: any
) => GenericRequestFailureAction;

export const genericRequestFailureAction = (
  type: string
): GenericRequestFailureActionCreator => (
  error?: any
): GenericRequestFailureAction => ({
  payload: { error },
  type,
});
