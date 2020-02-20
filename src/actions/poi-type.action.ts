import { PoiType } from 'src/types/response/PoiType';
import { createEntityCrudActions } from '../utils/basic-crud.action';

const entityCrudActions = createEntityCrudActions<PoiType>('poi-type');
export const { types, actions } = entityCrudActions;
