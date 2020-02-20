import { schema } from 'normalizr';

export const categorySchema = new schema.Entity('categories');
export const categoryListSchema = [categorySchema];
