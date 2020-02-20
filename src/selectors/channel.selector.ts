import { channelListSchema } from 'src/schemas/channel.schema';
import { Channel } from 'src/types/response/Channel';
import {
  getDenormalizedEntities,
  getEntitiesByMallId,
  getEntityArray,
  getEntityArrayById,
  getEntityById,
  getEntityIdsByMallId,
  getGlobalEntityArray,
  getGlobalEntityIds,
  getTranslatedEntityById,
} from 'src/utils/selector.utils';

const entityName = 'channels';

export const getChannelArray = getEntityArray<Channel>(entityName);

export const getGlobalChannelIds = getGlobalEntityIds(entityName);

export const getGlobalChannelList = getGlobalEntityArray<Channel>(entityName);

export const getChannelsByMallId = getEntitiesByMallId<Channel>(entityName);

export const getChannelIdsByMallId = getEntityIdsByMallId<Channel>(entityName);

export const getChannelById = getEntityById<Channel>(entityName);

export const getDenormalizedChannels = getDenormalizedEntities<Channel>(
  entityName,
  channelListSchema
);

export const getTranslatedChannelById = getTranslatedEntityById<Channel>(
  entityName
);

export const getChannelArrayById = getEntityArrayById<Channel>(entityName);
