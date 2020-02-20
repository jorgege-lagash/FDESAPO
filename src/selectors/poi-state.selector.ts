import { poiStateListSchema } from 'src/schemas/poi-state.schema';
import { PoiState } from 'src/types/response/PoiState';
import {
  getDenormalizedEntities,
  getEntityArray,
  getEntityArrayById,
  getEntityById,
  getGlobalEntityIds,
  getTranslatedEntityById,
} from 'src/utils/selector.utils';

const entityName = 'poiState';

export const getPoiStateList = getEntityArray<PoiState>(entityName);

export const getGlobalPoiStateIds = getGlobalEntityIds(entityName);

export const getPoiStateById = getEntityById<PoiState>(entityName);

export const getPoiStateArrayById = getEntityArrayById<PoiState>(entityName);

export const getDenormalizedPoiState = getDenormalizedEntities<PoiState>(
  entityName,
  poiStateListSchema
);

export const getTranslatedPoiStateById = getTranslatedEntityById<PoiState>(
  entityName
);
