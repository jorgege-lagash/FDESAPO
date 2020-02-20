import { PoiState } from 'src/types/response/PoiState';
import { createEntityCrudActions } from 'src/utils/basic-crud.action';

const entityCrudActions = createEntityCrudActions<PoiState>('poi-state');

export const { types, actions: entityActions } = entityCrudActions;

export const actions = {
  ...entityActions,
  fetchPoiStateList: entityActions.fetchEntityList,
  fetchPoiStateListFailure: entityActions.fetchEntityListFailure,
  fetchPoiStateListSuccess: entityActions.fetchEntityListSuccess,
};
