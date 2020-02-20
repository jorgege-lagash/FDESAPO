import { Channel } from 'src/types/response/Channel';
import { createBasicCrudRequests } from 'src/utils/basic-crud.api';

const api = createBasicCrudRequests<Channel>('channels');

export const channel = {
  ...api,
};
