import { categoryListSchema } from 'src/schemas/category.schema';
import { Category } from 'src/types/response/Category';
import {
  getDenormalizedEntities,
  getEntitiesByMallId,
  getEntityArray,
  getEntityById,
  getEntityIdsByMallId,
  getGlobalEntityIds,
  getTranslatedEntityById,
} from 'src/utils/selector.utils';

const entityName = 'categories';

export const getCategoryArray = getEntityArray<Category>(entityName);

export const getGlobalCategoryIds = getGlobalEntityIds(entityName);

export const getCategoriesByMallId = getEntitiesByMallId<Category>(entityName);

export const getCategoryIdsByMallId = getEntityIdsByMallId<Category>(
  entityName
);

export const getCategoryById = getEntityById<Category>(entityName);

export const getDenormalizedCategories = getDenormalizedEntities<Category>(
  entityName,
  categoryListSchema
);

export const getTranslatedCategoryById = getTranslatedEntityById<Category>(
  entityName
);
