import { Deal } from 'src/types/response/Deal';
import { DealTranslationFormProps } from 'src/types/TranslationForm';
import { createEntityCrudActions } from 'src/utils/basic-crud.action';

const entityCrudActions = createEntityCrudActions<
  Deal,
  DealTranslationFormProps
>('deal');

export const { types, actions: entityActions } = entityCrudActions;

export const actions = {
  ...entityActions,
  fetchDealList: entityActions.fetchPagedEntityList,
  fetchDealListFailure: entityActions.fetchPagedEntityListFailure,
  fetchDealListSuccess: entityActions.fetchPagedEntityListSuccess,
};
