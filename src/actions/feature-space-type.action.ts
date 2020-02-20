import { FeatureSpaceType } from 'src/types/response/FeatureSpaceType';
import { createEntityCrudActions } from '../utils/basic-crud.action';

const entityCrudActions = createEntityCrudActions<FeatureSpaceType>(
  'feature-space-type'
);
export const { types, actions } = entityCrudActions;
