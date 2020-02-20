import { PoiType } from 'src/types/response/PoiType';
import { createBasicCrudRequests } from '../utils/basic-crud.api';

const crudRequests = createBasicCrudRequests<PoiType>('poi-types');

export const poiType = crudRequests;
