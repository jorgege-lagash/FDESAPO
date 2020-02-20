import { schema } from 'normalizr';

export const eventDirectorySchema = new schema.Entity('events');
export const eventDirectoryListSchema = [eventDirectorySchema];
