import { Action } from '../Action';
import { Schedule, ScheduleType } from '../response/Schedule';

export interface ScheduleListRequestAction extends Action {
  payload: {
    mallId: number;
    scheduleType: ScheduleType;
  };
}

export interface CreateScheduleRequestAction extends Action {
  payload: {
    mallId: number;
    schedules: Schedule[];
  };
}

export interface UpdateScheduleRequestAction extends Action {
  payload: {
    mallId: number;
    schedule: Schedule;
  };
}
