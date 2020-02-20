import { PoiState } from 'src/types/response/PoiState';
import { createBasicCrudRequests } from 'src/utils/basic-crud.api';

const api = createBasicCrudRequests<PoiState>('poi-states');

export const poiState = {
  ...api,
};
