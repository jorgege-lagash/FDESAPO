import { normalize } from 'normalizr';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

import { actions, types } from 'src/actions/schedule.action';
import * as api from 'src/api';
import { scheduleListSchema } from 'src/schemas/schedule.schema';
import {
  CreateScheduleRequestAction,
  ScheduleListRequestAction,
  UpdateScheduleRequestAction,
} from 'src/types/action/ScheduleActions';
import { Schedule, ScheduleDTO } from 'src/types/response/Schedule';

export function* fetchMallSchedules(action: ScheduleListRequestAction) {
  try {
    const { mallId, scheduleType } = action.payload;

    const fetchSchedulesResponse: ScheduleDTO[] = yield call(
      api.schedule.fetch,
      mallId,
      undefined,
      undefined,
      scheduleType
    );

    const { entities, result: scheduleIds } = normalize(
      fetchSchedulesResponse.map((s) => new Schedule(s)),
      scheduleListSchema
    );

    yield put(actions.fetchScheduleListSuccess(scheduleIds, entities));
  } catch (e) {
    yield put(actions.fetchScheduleListFailure(e));
  }
}

export function* createMallSchedules(action: CreateScheduleRequestAction) {
  try {
    const { mallId, schedules } = action.payload;

    const response: ScheduleDTO[] = yield call(
      api.schedule.create,
      mallId,
      schedules.map((s) => s.toDTO())
    );

    const { entities, result: scheduleIds } = normalize(
      response.map((s) => new Schedule(s)),
      scheduleListSchema
    );

    yield put(actions.createScheduleSuccess(scheduleIds, entities));
  } catch (e) {
    yield put(actions.createScheduleFailure(e));
  }
}

export function* updateMallSchedules(action: UpdateScheduleRequestAction) {
  const { mallId, schedule } = action.payload;
  try {
    const response: ScheduleDTO = yield call(
      api.schedule.update,
      mallId,
      schedule.id,
      schedule.toDTO()
    );

    const { entities, result: scheduleIds } = normalize(
      [new Schedule(response)],
      scheduleListSchema
    );

    yield put(actions.updateScheduleSuccess(scheduleIds, entities));
  } catch (e) {
    if (e.statusCode === 404) {
      yield put(actions.createSchedule(mallId, [schedule]));
    }
    yield put(actions.updateScheduleFailure(e));
  }
}

export const scheduleSagas = [
  takeLatest(types.FETCH_SCHEDULE_LIST_REQUEST, fetchMallSchedules),
  takeEvery(types.CREATE_SCHEDULE_REQUEST, createMallSchedules),
  takeEvery(types.UPDATE_SCHEDULE_REQUEST, updateMallSchedules),
];
