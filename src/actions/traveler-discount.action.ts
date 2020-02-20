import { Action } from 'src/types/Action';
import { TravelerDiscount } from 'src/types/response/TravelerDiscount';
import { TravelerDiscountTranslationProps } from 'src/types/TranslationForm';
import { createEntityCrudActions } from 'src/utils/basic-crud.action';

const entityName = 'traveler_discount';
const entityNameUppercase = entityName.toUpperCase();

const entityCrudActions = createEntityCrudActions<
  TravelerDiscount,
  TravelerDiscountTranslationProps
>(entityName);
const crudActions = entityCrudActions;

const actionTypes = {
  ...crudActions.types,
  TRAVELER_DISCOUNT_PICTURE_UPLOAD: `${entityNameUppercase}/PICTURE_UPLOAD`,
  TRAVELER_DISCOUNT_PICTURE_UPLOAD_FAILURE: `${entityNameUppercase}/PICTURE_UPLOAD_FAILURE`,
  TRAVELER_DISCOUNT_PICTURE_UPLOAD_SUCCESS: `${entityNameUppercase}/PICTURE_UPLOAD_SUCCESS`,
};
export interface TravelerDiscountPictureUploadSuccessAction extends Action {
  payload: {
    mallId: number;
    resourceId: number;
    fileId: number;
  };
}

const travelerDiscountPictureUploadSuccess = (
  mallId: number,
  resourceId: number,
  fileId: number
): TravelerDiscountPictureUploadSuccessAction => ({
  type: types.TRAVELER_DISCOUNT_PICTURE_UPLOAD_SUCCESS,
  payload: {
    mallId,
    resourceId,
    fileId,
  },
});

export interface TravelerDiscountPictureUploadFailureAction extends Action {
  payload: {
    mallId: number;
    resourceId: number;
  };
}

const travelerDiscountPictureUploadFailure = (
  mallId: number,
  resourceId: number
): TravelerDiscountPictureUploadFailureAction => ({
  type: types.TRAVELER_DISCOUNT_PICTURE_UPLOAD_FAILURE,
  payload: {
    mallId,
    resourceId,
  },
});

export const { types, actions } = {
  types: actionTypes,
  actions: {
    ...crudActions.actions,
    travelerDiscountPictureUploadSuccess,
    travelerDiscountPictureUploadFailure,
  },
};
