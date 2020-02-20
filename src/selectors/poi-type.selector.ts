import { poiTypeListSchema } from 'src/schemas/poi-type.schema';
import { PoiType } from 'src/types/response/PoiType';
import {
  getDenormalizedEntities,
  getEntityById,
  getGlobalEntityArray,
  getGlobalEntityIds,
} from 'src/utils/selector.utils';

const entityName = 'poiTypes';

export const getPoiTypeList = getGlobalEntityArray<PoiType>(entityName);

export const getGlobalPoiTypeIds = getGlobalEntityIds(entityName);

export const getPoiTypeById = getEntityById<PoiType>(entityName);

export const getDenormalizedCategories = getDenormalizedEntities<PoiType>(
  entityName,
  poiTypeListSchema
);
