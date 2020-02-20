import { pwBuildingListSchema } from 'src/schemas/maas.schema';
import { PwBuilding } from 'src/types/response/PwBuilding';
import {
  getDenormalizedEntities,
  getEntityArray,
  getEntityArrayById,
  getEntityById,
  getGlobalEntityIds,
} from 'src/utils/selector.utils';

const entityName = 'pwbuildings';

export const getPwBuildingArray = getEntityArray<PwBuilding>(entityName);

export const getGlobalPwBuildingIds = getGlobalEntityIds(entityName);

export const getPwBuildingById = getEntityById<PwBuilding>(entityName);

export const getDenormalizedPwBuildings = getDenormalizedEntities<PwBuilding>(
  entityName,
  pwBuildingListSchema
);

export const getPwBuildingArrayById = getEntityArrayById<PwBuilding>(
  entityName
);
