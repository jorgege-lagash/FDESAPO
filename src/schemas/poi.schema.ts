import { schema } from 'normalizr';
import { categorySchema } from './category.schema';
import { fileSchema } from './file.schema';

export const poiSchema = new schema.Entity(
  'pois',
  {
    logo: fileSchema,
    categories: [categorySchema],
  },
  { idAttribute: 'id' }
);

export const poiListSchema = [poiSchema];
