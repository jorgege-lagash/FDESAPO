import { pwFloorListSchema } from 'src/schemas/maas.schema';
import { PwFloor } from 'src/types/response/PwBuilding';
import {
  getDenormalizedEntities,
  getEntityArray,
  getEntityArrayById,
  getEntityById,
  getGlobalEntityIds,
} from 'src/utils/selector.utils';

const entityName = 'pwfloors';

export const getPwFloorArray = getEntityArray<PwFloor>(entityName);

export const getGlobalPwFloorIds = getGlobalEntityIds(entityName);

export const getPwFloorById = getEntityById<PwFloor>(entityName);

export const getDenormalizedPwFloors = getDenormalizedEntities<PwFloor>(
  entityName,
  pwFloorListSchema
);

export const getPwFloorArrayById = getEntityArrayById<PwFloor>(entityName);
