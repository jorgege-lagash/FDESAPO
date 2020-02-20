import { FeatureSpaceType } from 'src/types/response/FeatureSpaceType';
import { createBasicCrudRequests } from '../utils/basic-crud.api';

const crudRequests = createBasicCrudRequests<FeatureSpaceType>(
  'feature-space-types'
);

export const featureSpaceTypes = crudRequests;
