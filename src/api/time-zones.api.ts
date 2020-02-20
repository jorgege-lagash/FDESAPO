import { createBasicCrudRequests } from 'src/utils/basic-crud.api';

const api = createBasicCrudRequests<string>('time-zones');

export const timeZones = {
  ...api,
};
