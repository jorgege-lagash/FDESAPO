import { schema } from 'normalizr';

export const poiTypeSchema = new schema.Entity('poiTypes');
export const poiTypeListSchema = [poiTypeSchema];
