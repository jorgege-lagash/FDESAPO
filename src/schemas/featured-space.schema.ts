import { schema } from 'normalizr';

export const featuredSpaceSchema = new schema.Entity('featuredSpaces');
export const featuredSpaceListSchema = [featuredSpaceSchema];
