import { featuredSpaceListSchema } from 'src/schemas/featured-space.schema';
import { FeaturedSpace } from 'src/types/response/FeaturedSpace';
import {
  getDenormalizedEntities,
  getEntitiesByMallId,
  getEntityArray,
  getEntityById,
  getEntityIdsByMallId,
  getGlobalEntityIds,
  getTranslatedEntityById,
} from 'src/utils/selector.utils';

const entityName = 'featuredSpaces';

export const getFeaturedSpaceArray = getEntityArray<FeaturedSpace>(entityName);

export const getGlobalFeaturedSpaceIds = getGlobalEntityIds(entityName);

export const getFeaturedSpacesByMallId = getEntitiesByMallId<FeaturedSpace>(
  entityName
);

export const getFeaturedSpaceIdsByMallId = getEntityIdsByMallId<FeaturedSpace>(
  entityName
);

export const getFeaturedSpaceById = getEntityById<FeaturedSpace>(entityName);

export const getDenormalizedFeaturedSpaces = getDenormalizedEntities<
  FeaturedSpace
>(entityName, featuredSpaceListSchema);

export const getTranslatedFeaturedSpaceById = getTranslatedEntityById<
  FeaturedSpace
>(entityName);
