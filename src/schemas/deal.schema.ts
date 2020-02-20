import { schema } from 'normalizr';

export const dealSchema = new schema.Entity('deals');
export const dealListSchema = [dealSchema];
