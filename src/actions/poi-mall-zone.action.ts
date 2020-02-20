import { PoiMallZone } from 'src/types/response/PoiMallZone';
import { createEntityCrudActions } from 'src/utils/basic-crud.action';

const entityCrudActions = createEntityCrudActions<PoiMallZone>('poiMallZone');

export const { types, actions: entityActions } = entityCrudActions;

export const actions = {
  ...entityActions,
  fetchPoiMallZoneList: entityActions.fetchEntityList,
  fetchPoiMallZoneListFailure: entityActions.fetchEntityListFailure,
  fetchPoiMallZoneListSuccess: entityActions.fetchEntityListSuccess,
};
