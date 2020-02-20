import { featureSpaceTypeListSchema } from 'src/schemas/feature-space-type.schema';
import { FeatureSpaceType } from 'src/types/response/FeatureSpaceType';
import {
  getDenormalizedEntities,
  getEntityById,
  getGlobalEntityArray,
  getGlobalEntityIds,
} from 'src/utils/selector.utils';

const entityName = 'featureSpaceTypes';

export const getFeatureSpaceTypeList = getGlobalEntityArray<FeatureSpaceType>(
  entityName
);

export const getGlobalFeatureSpaceTypeIds = getGlobalEntityIds(entityName);

export const getFeatureSpaceTypeById = getEntityById<FeatureSpaceType>(
  entityName
);

export const getDenormalizedFeatureSpaceType = getDenormalizedEntities<
  FeatureSpaceType
>(entityName, featureSpaceTypeListSchema);
