import { schema } from 'normalizr';
import { mallSchema } from './malls.schema';

export const permissionSchema = new schema.Entity(
  'permissions',
  { mall: mallSchema },
  { idAttribute: 'id' }
);

export const permissionListSchema = [permissionSchema];
