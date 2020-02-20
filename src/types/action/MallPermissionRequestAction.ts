import { Action } from '../Action';

export interface MallPermissionRequestAction extends Action {
  payload: {
    userId: number;
    mallId: number;
  };
}
