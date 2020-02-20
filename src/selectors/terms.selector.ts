import { get } from 'lodash';
import { ApplicationState } from 'src/reducers';
import { TypedLooseObject } from 'src/types/LooseObject';
import { TermsOfService } from 'src/types/response/TermsOfService';

export const getTermByMallId = (state: ApplicationState, mallId: string) => {
  const termsOfService: TypedLooseObject<TermsOfService> = get(
    state,
    'entities.termsOfService',
    {}
  );
  const termIds = Object.keys(termsOfService);
  return termIds
    .map((id) => termsOfService[id])
    .filter((term) => term.mallId === Number(mallId));
};
