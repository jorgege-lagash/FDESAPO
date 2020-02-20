import { Action } from 'src/types/Action';
import { FeaturedSpace } from 'src/types/response/FeaturedSpace';
import { FeaturedSpaceTranslationFormProps } from 'src/types/TranslationForm';
import { createEntityCrudActions } from 'src/utils/basic-crud.action';

const entityName = 'featured_space';
const entityNameUppercase = entityName.toUpperCase();

const entityCrudActions = createEntityCrudActions<
  FeaturedSpace,
  FeaturedSpaceTranslationFormProps
>(entityName);
const crudActions = entityCrudActions;

const actionTypes = {
  ...crudActions.types,
  FEATURED_SPACE_PICTURE_UPLOAD: `${entityNameUppercase}/PICTURE_UPLOAD`,
  FEATURED_SPACE_PICTURE_UPLOAD_FAILURE: `${entityNameUppercase}/PICTURE_UPLOAD_FAILURE`,
  FEATURED_SPACE_PICTURE_UPLOAD_SUCCESS: `${entityNameUppercase}/PICTURE_UPLOAD_SUCCESS`,
};
export interface FeaturedSpacePictureUploadSuccessAction extends Action {
  payload: {
    mallId: number;
    featuredSpaceId: number;
    fileId: number;
  };
}

const featuredSpacePictureUploadSuccess = (
  mallId: number,
  featuredSpaceId: number,
  fileId: number
): FeaturedSpacePictureUploadSuccessAction => ({
  type: types.FEATURED_SPACE_PICTURE_UPLOAD_SUCCESS,
  payload: {
    mallId,
    featuredSpaceId,
    fileId,
  },
});

export interface FeaturedSpacePictureUploadFailureAction extends Action {
  payload: {
    mallId: number;
    featuredSpaceId: number;
  };
}

const featuredSpacePictureUploadFailure = (
  mallId: number,
  featuredSpaceId: number
): FeaturedSpacePictureUploadFailureAction => ({
  type: types.FEATURED_SPACE_PICTURE_UPLOAD_FAILURE,
  payload: {
    mallId,
    featuredSpaceId,
  },
});

export const { types, actions } = {
  types: actionTypes,
  actions: {
    ...crudActions.actions,
    featuredSpaceLogoUploadSuccess: featuredSpacePictureUploadSuccess,
    featuredSpaceLogoUploadFailure: featuredSpacePictureUploadFailure,
  },
};
