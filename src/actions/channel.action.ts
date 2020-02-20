import { Channel } from 'src/types/response/Channel';
import { createEntityCrudActions } from 'src/utils/basic-crud.action';

const entityCrudActions = createEntityCrudActions<Channel>('channel');

export const { types, actions: entityActions } = entityCrudActions;

export const actions = {
  ...entityActions,
  fetchChannelList: entityActions.fetchPagedEntityList,
  fetchChannelListFailure: entityActions.fetchPagedEntityListFailure,
  fetchChannelListSuccess: entityActions.fetchPagedEntityListSuccess,
};
