import { Tag } from 'src/types/response/Tag';
import { createEntityCrudActions } from 'src/utils/basic-crud.action';

const entityCrudActions = createEntityCrudActions<Tag>('tag');

export const { types, actions: entityActions } = entityCrudActions;

export const actions = {
  ...entityActions,
  fetchTagList: entityActions.fetchEntityList,
  fetchTagListFailure: entityActions.fetchEntityListFailure,
  fetchTagListSuccess: entityActions.fetchEntityListSuccess,
};
