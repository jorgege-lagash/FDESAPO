import { schema } from 'normalizr';

export const featureSpaceTypeSchema = new schema.Entity('featureSpaceTypes');
export const featureSpaceTypeListSchema = [featureSpaceTypeSchema];
