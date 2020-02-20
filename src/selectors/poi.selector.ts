import { ApplicationState } from 'src/reducers';
import { poiListSchema } from 'src/schemas/poi.schema';
import { Poi } from 'src/types/response/POI';
import {
  getDenormalizedEntities,
  getEntitiesByMallId,
  getEntityArray,
  getEntityById,
  getEntityIdsByMallId,
  getGlobalEntityIds,
  getTranslatedEntityById,
} from 'src/utils/selector.utils';

const entityName = 'pois';

export const getPoiArray = getEntityArray<Poi>(entityName);

export const getGlobalPoiIds = getGlobalEntityIds(entityName);

export const getPoisByMallId = getEntitiesByMallId<Poi>(entityName);

export const getPoiIdsByMallId = getEntityIdsByMallId<Poi>(entityName);

export const getPoiById = getEntityById<Poi>(entityName);

export const getTranslatedPoiById = getTranslatedEntityById<Poi>(entityName);

export const getDenormalizedPois = getDenormalizedEntities<Poi>(
  entityName,
  poiListSchema
);
export const getDenormalizedPoi = (state: ApplicationState, poiId: number) => {
  const result = getDenormalizedPois(state, [poiId]);
  return result.length > 0 ? result[0] : null;
};
