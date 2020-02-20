import { createSelector } from 'reselect';
import { ApplicationState } from 'src/reducers';
import { pwPoiListSchema } from 'src/schemas/maas.schema';
import { PwPoi } from 'src/types/response/PwPoi';
import {
  getDenormalizedEntities,
  getEntityById,
  getGlobalEntityArray,
  getGlobalEntityIds,
} from 'src/utils/selector.utils';

const entityName = 'pwpois';

export const getGlobalPwPoiIds = getGlobalEntityIds(entityName);

export const getGlobalPwPoiList = getGlobalEntityArray<PwPoi>(entityName);

export const getPwPoiById = getEntityById<PwPoi>(entityName);

export const getDenormalizedPwPois = getDenormalizedEntities<PwPoi>(
  entityName,
  pwPoiListSchema
);

export const getPwPoisByFloorId = createSelector(
  [getGlobalPwPoiList, (state: ApplicationState, floorId: number) => floorId],
  (poiList: PwPoi[], floorId: number) =>
    poiList.filter((p) => Number(p.floorId) === Number(floorId))
);
