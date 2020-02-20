import { schema } from 'normalizr';

export const termsOfServiceSchema = new schema.Entity('termsOfService');
export const termsOfServiceListSchema = [termsOfServiceSchema];
