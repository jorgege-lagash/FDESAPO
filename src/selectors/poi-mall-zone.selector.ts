import { poiMallZoneListSchema } from 'src/schemas/poi-mall-zone.schema';
import { PoiMallZone } from 'src/types/response/PoiMallZone';
import {
  getDenormalizedEntities,
  getEntitiesByMallId,
  getEntityArray,
  getEntityById,
  getEntityIdsByMallId,
  getGlobalEntityIds,
  getTranslatedEntityById,
} from 'src/utils/selector.utils';

const entityName = 'poiMallZones';

export const getPoiMallZoneArray = getEntityArray<PoiMallZone>(entityName);

export const getGlobalPoiMallZoneIds = getGlobalEntityIds(entityName);

export const getPoiMallZonesByMallId = getEntitiesByMallId<PoiMallZone>(
  entityName
);

export const getPoiMallZoneIdsByMallId = getEntityIdsByMallId<PoiMallZone>(
  entityName
);

export const getPoiMallZoneById = getEntityById<PoiMallZone>(entityName);

export const getDenormalizedPoiMallZones = getDenormalizedEntities<PoiMallZone>(
  entityName,
  poiMallZoneListSchema
);

export const getTranslatedPoiMallZoneById = getTranslatedEntityById<
  PoiMallZone
>(entityName);
