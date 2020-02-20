import { Deal } from 'src/types/response/Deal';
import { createBasicCrudRequests } from 'src/utils/basic-crud.api';

const api = createBasicCrudRequests<Deal>('deals');

export const deal = {
  ...api,
};
