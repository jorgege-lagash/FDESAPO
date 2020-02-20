import { schema } from 'normalizr';

export const pwPoiSchema = new schema.Entity('pwpois');
export const pwPoiListSchema = [pwPoiSchema];

export const pwFloorSchema = new schema.Entity('pwfloors');
export const pwFloorListSchema = [pwFloorSchema];

export const pwBuildingSchema = new schema.Entity(
  'pwbuildings',
  {
    floors: pwFloorListSchema,
  },
  { idAttribute: 'id' }
);
export const pwBuildingListSchema = [pwBuildingSchema];
