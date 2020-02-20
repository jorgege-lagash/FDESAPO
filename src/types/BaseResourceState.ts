import { TypedLooseObject } from './LooseObject';

export interface BaseResourceState<TId> {
  saved: boolean;
  error?: any;
  isLoading: boolean;
  list: TId[];
  filtered: TId[];
  selected: TId[];
  pages: TypedLooseObject<number[]>;
  total: number;
  page: number;
  perPage: number;
}
