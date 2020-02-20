import { tagListSchema } from 'src/schemas/tag.schema';
import { Tag } from 'src/types/response/Tag';
import {
  getDenormalizedEntities,
  getEntitiesByMallId,
  getEntityArray,
  getEntityArrayById,
  getEntityById,
  getEntityIdsByMallId,
  getGlobalEntityIds,
  getTranslatedEntityById,
} from 'src/utils/selector.utils';

const entityName = 'tags';

export const getTagArray = getEntityArray<Tag>(entityName);

export const getGlobalTagIds = getGlobalEntityIds(entityName);

export const getTagsByMallId = getEntitiesByMallId<Tag>(entityName);

export const getTagIdsByMallId = getEntityIdsByMallId<Tag>(entityName);

export const getTagById = getEntityById<Tag>(entityName);

export const getTagArrayById = getEntityArrayById<Tag>(entityName);

export const getDenormalizedTags = getDenormalizedEntities<Tag>(
  entityName,
  tagListSchema
);

export const getTranslatedTagById = getTranslatedEntityById<Tag>(entityName);
