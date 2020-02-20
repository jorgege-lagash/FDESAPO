import { Category } from 'src/types/response/Category';
import { createEntityCrudActions } from 'src/utils/basic-crud.action';

const entityCrudActions = createEntityCrudActions<Category>('category');

export const { types, actions: entityActions } = entityCrudActions;

export const actions = {
  ...entityActions,
  fetchCategoryList: entityActions.fetchEntityList,
  fetchCategoryListFailure: entityActions.fetchEntityListFailure,
  fetchCategoryListSuccess: entityActions.fetchEntityListSuccess,
};
