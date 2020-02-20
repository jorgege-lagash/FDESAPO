import { schema } from 'normalizr';

export const channelSchema = new schema.Entity('channels');
export const channelListSchema = [channelSchema];
