import { schema } from 'normalizr';

export const poiStateSchema = new schema.Entity('poiState');
export const poiStateListSchema = [poiStateSchema];
