import { Moment } from 'moment';
import { Action } from '../Action';
import { TypedLooseObject } from '../LooseObject';
import { Mall } from '../Mall';
import { MallTranslationFormProps } from '../TranslationForm';

export interface MallListRequestAction extends Action {
  payload: {};
}

export interface CreateMallRequestAction extends Action {
  payload: {
    userId: number;
    mall: Mall;
    schedules?: Array<[Moment, Moment]>;
    translations: TypedLooseObject<MallTranslationFormProps>;
  };
}

export interface UpdateMallRequestAction extends Action {
  payload: {
    mallId: number;
    mall: Partial<Mall>;
    translations: TypedLooseObject<MallTranslationFormProps>;
  };
}
