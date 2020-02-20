import { Category } from 'src/types/response/Category';
import { createBasicCrudRequests } from 'src/utils/basic-crud.api';

const api = createBasicCrudRequests<Category>('categories');

export const category = {
  ...api,
};
