import { schema } from 'normalizr';

export const zoneSchema = new schema.Entity('zones');
export const zoneListSchema = [zoneSchema];
