import { schema } from 'normalizr';

export const mallSchema = new schema.Entity('malls');
export const mallListSchema = [mallSchema];
