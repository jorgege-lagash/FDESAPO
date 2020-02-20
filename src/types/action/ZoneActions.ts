import { Action } from '../Action';
import { Zone } from '../response/Zone';

export interface ZoneListRequestAction extends Action {
  payload: {
    mallId: number;
  };
}

export interface ZoneRequestAction extends Action {
  payload: {
    mallId: number;
    zoneId: number;
  };
}

export interface CreateZoneRequestAction extends Action {
  payload: {
    mallId: number;
    zone: Zone;
  };
}

export interface UpdateZoneRequestAction extends Action {
  payload: {
    mallId: number;
    zoneId: number;
    zone: Partial<Zone>;
  };
}
