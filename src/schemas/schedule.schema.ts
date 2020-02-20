import { schema } from 'normalizr';

export const scheduleSchema = new schema.Entity('schedules');
export const scheduleListSchema = [scheduleSchema];
