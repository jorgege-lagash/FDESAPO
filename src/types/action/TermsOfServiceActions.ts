import { Action } from '../Action';
import { TermsOfService } from '../response/TermsOfService';

export interface TermsOfServiceListRequestAction extends Action {
  payload: {
    mallId: number;
  };
}

export interface CreateTermsOfServiceRequestAction extends Action {
  payload: {
    mallId: number;
    termsOfService: TermsOfService;
  };
}

export interface UpdateTermsOfServiceRequestAction extends Action {
  payload: {
    mallId: number;
    termsOfService: TermsOfService;
  };
}
