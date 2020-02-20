import { normalize } from 'normalizr';
import { call, put } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { scheduleListSchema } from 'src/schemas/schedule.schema';
import { Schedule, ScheduleDTO } from 'src/types/response/Schedule';
import { actions } from '../actions/schedule.action';
import * as Api from '../api';
import {
  createMallSchedules,
  fetchMallSchedules,
  updateMallSchedules,
} from './schedule.saga';

const schedules: ScheduleDTO[] = [
  {
    id: 1,
    title: 'schedule',
    description: 'schedule',
    // tslint:disable-next-line:no-duplicate-string
    startDate: '2018-11-12T14:32:08.000Z',
    // tslint:disable-next-line:no-duplicate-string
    endDate: '2019-11-12T14:32:17.000Z',
    // tslint:disable-next-line:no-duplicate-string
    startTime: '2018-11-16T15:00:00.000Z',
    // tslint:disable-next-line:no-duplicate-string
    endTime: '2018-11-17T02:00:00.000Z',
    isRecurring: true,
    recurringType: 'weekly',
    dayOfWeek: 1,
    scheduleType: 'default',
    mallId: 1,
  },
  {
    id: 2,
    title: 'schedule',
    description: 'schedule',
    startDate: '2018-11-12T14:32:08.000Z',
    endDate: '2019-11-12T14:32:17.000Z',
    startTime: '2018-11-16T15:00:00.000Z',
    endTime: '2018-11-17T02:00:00.000Z',
    isRecurring: true,
    recurringType: 'weekly',
    dayOfWeek: 2,
    scheduleType: 'default',
    mallId: 1,
  },
];

describe('fetchMallSchedules', () => {
  const mallId = 1;
  const scheduleType = 'default';
  const generator = cloneableGenerator(fetchMallSchedules)(
    actions.fetchScheduleList(mallId, 'default')
  );

  test("call's schedule.fetch", () => {
    expect(generator.next().value).toEqual(
      call(Api.schedule.fetch, mallId, undefined, undefined, scheduleType)
    );
  });

  test('put fetchSuccess with correct payload.', () => {
    const clone = generator.clone();
    const { entities, result: scheduleIds } = normalize(
      schedules.map((s) => new Schedule(s)),
      scheduleListSchema
    );
    expect(JSON.stringify(clone.next(schedules).value)).toEqual(
      JSON.stringify(
        put(actions.fetchScheduleListSuccess(scheduleIds, entities))
      )
    );
    expect(clone.next().done).toBe(true);
  });

  test('put fetchFailure with correct payload.', () => {
    const clone = generator.clone();
    const error = {
      statusCode: 404,
      message: 'ups!',
    };
    if (clone.throw) {
      expect(clone.throw(error).value).toEqual(
        put(actions.fetchScheduleListFailure(error))
      );
      expect(clone.next().done).toBe(true);
    }
  });
});

describe('createMallSchedule', () => {
  const mallId = 1;
  const scheduleData: Schedule[] = schedules.map((s) => new Schedule(s));
  const scheduleDTOData: ScheduleDTO[] = scheduleData.map((s) => s.toDTO());
  const generator = cloneableGenerator(createMallSchedules)(
    actions.createSchedule(mallId, scheduleData)
  );

  test("call's schedule.create", () => {
    expect(generator.next().value).toEqual(
      call(Api.schedule.create, mallId, scheduleDTOData)
    );
  });

  test('put createSuccess with correct payload.', () => {
    const clone = generator.clone();

    const { entities, result: scheduleIds } = normalize(
      scheduleDTOData.map((s) => new Schedule(s)),
      scheduleListSchema
    );
    expect(JSON.stringify(clone.next(scheduleDTOData).value)).toEqual(
      JSON.stringify(put(actions.createScheduleSuccess(scheduleIds, entities)))
    );
    expect(clone.next().done).toBe(true);
  });

  test('put createFailure with correct payload.', () => {
    const clone = generator.clone();
    const error = {
      statusCode: 404,
      message: 'ups!',
    };
    if (clone.throw) {
      expect(clone.throw(error).value).toEqual(
        put(actions.createScheduleFailure(error))
      );
      expect(clone.next().done).toBe(true);
    }
  });
});

describe('updateMallSchedule', () => {
  const mallId = 1;
  const scheduleId = 1;
  const schedule: Schedule = new Schedule(schedules[0]);
  const action = actions.updateSchedule(mallId, schedule);
  const generator = cloneableGenerator(updateMallSchedules)(action);

  test("call's schedule.update", () => {
    expect(generator.next().value).toEqual(
      call(Api.schedule.update, mallId, scheduleId, schedule.toDTO())
    );
  });

  test('put updateSuccess with correct payload.', () => {
    const clone = generator.clone();
    const { entities, result: scheduleIds } = normalize(
      [schedule],
      scheduleListSchema
    );
    expect(clone.next(schedule).value).toEqual(
      put(actions.updateScheduleSuccess(scheduleIds, entities))
    );
    expect(clone.next().done).toBe(true);
  });

  test('put updateFailure with correct payload.', () => {
    const clone = generator.clone();
    const error = {
      statusCode: 400,
      message: 'ups!',
    };
    if (clone.throw) {
      expect(clone.throw(error).value).toEqual(
        put(actions.updateScheduleFailure(error))
      );
    }
  });
});
