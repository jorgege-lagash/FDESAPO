import {
  CreateScheduleRequestAction,
  ScheduleListRequestAction,
  UpdateScheduleRequestAction,
} from '../types/action/ScheduleActions';
import { Schedule, ScheduleType } from '../types/response/Schedule';
import {
  genericEntitySuccessAction,
  genericRequestFailureAction,
} from './action-utils';

export const types = {
  CREATE_SCHEDULE_FAILURE: 'SCHEDULE/CREATE_SCHEDULE_FAILURE',
  CREATE_SCHEDULE_REQUEST: 'SCHEDULE/CREATE_SCHEDULE_REQUEST',
  CREATE_SCHEDULE_SUCCESS: 'SCHEDULE/CREATE_SCHEDULE_SUCCESS',
  FETCH_SCHEDULE_LIST_FAILURE: 'SCHEDULE/FETCH_SCHEDULE_LIST_FAILURE',
  FETCH_SCHEDULE_LIST_REQUEST: 'SCHEDULE/FETCH_SCHEDULE_LIST_REQUEST',
  FETCH_SCHEDULE_LIST_SUCCESS: 'SCHEDULE/FETCH_SCHEDULE_LIST_SUCCESS',
  UPDATE_SCHEDULE_FAILURE: 'SCHEDULE/UPDATE_SCHEDULE_FAILURE',
  UPDATE_SCHEDULE_REQUEST: 'SCHEDULE/UPDATE_SCHEDULE_REQUEST',
  UPDATE_SCHEDULE_SUCCESS: 'SCHEDULE/UPDATE_SCHEDULE_SUCCESS',
};

const createSchedule = (
  mallId: number,
  schedules: Schedule[]
): CreateScheduleRequestAction => {
  return {
    type: types.CREATE_SCHEDULE_REQUEST,
    payload: {
      mallId,
      schedules,
    },
  };
};

const createScheduleSuccess = genericEntitySuccessAction(
  types.CREATE_SCHEDULE_SUCCESS
);

const createScheduleFailure = genericRequestFailureAction(
  types.CREATE_SCHEDULE_FAILURE
);

const fetchScheduleList = (
  mallId: number,
  scheduleType: ScheduleType
): ScheduleListRequestAction => {
  return {
    type: types.FETCH_SCHEDULE_LIST_REQUEST,
    payload: { mallId, scheduleType },
  };
};

const fetchScheduleListSuccess = genericEntitySuccessAction(
  types.FETCH_SCHEDULE_LIST_SUCCESS
);

const fetchScheduleListFailure = genericRequestFailureAction(
  types.FETCH_SCHEDULE_LIST_SUCCESS
);

const updateSchedule = (
  mallId: number,
  schedule: Schedule
): UpdateScheduleRequestAction => {
  return {
    type: types.UPDATE_SCHEDULE_REQUEST,
    payload: {
      mallId,
      schedule,
    },
  };
};

const updateScheduleSuccess = genericEntitySuccessAction(
  types.UPDATE_SCHEDULE_SUCCESS
);

const updateScheduleFailure = genericRequestFailureAction(
  types.UPDATE_SCHEDULE_FAILURE
);

export const actions = {
  createScheduleFailure,
  createSchedule,
  createScheduleSuccess,
  fetchScheduleList,
  fetchScheduleListSuccess,
  fetchScheduleListFailure,
  updateSchedule,
  updateScheduleFailure,
  updateScheduleSuccess,
};
