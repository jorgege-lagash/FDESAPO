import { schema } from 'normalizr';

export const tagSchema = new schema.Entity('tags');
export const tagListSchema = [tagSchema];
