import { schema } from 'normalizr';

export const fileSchema = new schema.Entity('files');
export const fileListSchema = [fileSchema];
