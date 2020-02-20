import { Action } from 'src/types/Action';
import { EventDirectory } from 'src/types/response/EventDirectory';
import { createEntityCrudActions } from 'src/utils/basic-crud.action';

const entityName = 'event_directory';
const entityNameUppercase = entityName.toUpperCase();

const entityCrudActions = createEntityCrudActions<EventDirectory>(entityName);

export const { types: crudTypes, actions: entityActions } = entityCrudActions;

export const types = {
  ...crudTypes,
  EVENT_DIRECTORY_PICTURE_UPLOAD: `${entityNameUppercase}/PICTURE_UPLOAD`,
  EVENT_DIRECTORY_PICTURE_UPLOAD_FAILURE: `${entityNameUppercase}/PICTURE_UPLOAD_FAILURE`,
  EVENT_DIRECTORY_PICTURE_UPLOAD_SUCCESS: `${entityNameUppercase}/PICTURE_UPLOAD_SUCCESS`,
};

export interface EventDirectoryPictureUploadSuccessAction extends Action {
  payload: {
    mallId: number;
    featuredSpaceId: number;
    fileId: number;
  };
}

const eventDirectoryPictureUploadSuccess = (
  mallId: number,
  featuredSpaceId: number,
  fileId: number
): EventDirectoryPictureUploadSuccessAction => ({
  type: types.EVENT_DIRECTORY_PICTURE_UPLOAD_SUCCESS,
  payload: {
    mallId,
    featuredSpaceId,
    fileId,
  },
});

export interface EventDirectoryPictureUploadFailureAction extends Action {
  payload: {
    mallId: number;
    featuredSpaceId: number;
  };
}

const eventDirectoryPictureUploadFailure = (
  mallId: number,
  featuredSpaceId: number
): EventDirectoryPictureUploadFailureAction => ({
  type: types.EVENT_DIRECTORY_PICTURE_UPLOAD_FAILURE,
  payload: {
    mallId,
    featuredSpaceId,
  },
});

export const actions = {
  ...entityActions,
  fetchEventDirectoryList: entityActions.fetchEntityList,
  fetchEventDirectoryListFailure: entityActions.fetchEntityListFailure,
  fetchEventDirectoryListSuccess: entityActions.fetchEntityListSuccess,
  eventDirectoryPictureUploadSuccess,
  eventDirectoryPictureUploadFailure,
};
