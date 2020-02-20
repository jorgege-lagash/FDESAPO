import { ApplicationState } from 'src/reducers';
import { TypedLooseObject } from 'src/types/LooseObject';
import { ScheduleDTO } from 'src/types/response/Schedule';
import { getMallById, getMallSchedulesByType } from './mall.selector';
const scheduleList: TypedLooseObject<ScheduleDTO> = {
  '1': {
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
  '2': {
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
  '3': {
    id: 3,
    title: 'schedule',
    description: 'schedule',
    startDate: '2018-11-12T14:32:08.000Z',
    endDate: '2019-11-12T14:32:17.000Z',
    startTime: '2018-11-16T15:00:00.000Z',
    endTime: '2018-11-17T02:00:00.000Z',
    isRecurring: true,
    recurringType: 'weekly',
    dayOfWeek: 3,
    scheduleType: 'default',
    mallId: 1,
  },
  '4': {
    id: 4,
    title: 'schedule',
    description: 'schedule',
    startDate: '2018-11-12T14:32:08.000Z',
    endDate: '2019-11-12T14:32:17.000Z',
    startTime: '2018-11-16T15:00:00.000Z',
    endTime: '2018-11-17T03:00:00.000Z',
    isRecurring: true,
    recurringType: 'weekly',
    dayOfWeek: 4,
    scheduleType: 'default',
    mallId: 1,
  },
  '5': {
    id: 5,
    title: 'schedule',
    description: 'schedule',
    startDate: '2018-11-12T14:32:08.000Z',
    endDate: '2019-11-12T14:32:17.000Z',
    startTime: '2018-11-16T15:00:00.000Z',
    endTime: '2018-11-17T04:00:00.000Z',
    isRecurring: true,
    recurringType: 'weekly',
    dayOfWeek: 5,
    scheduleType: 'default',
    mallId: 1,
  },
  '6': {
    id: 6,
    title: 'schedule',
    description: 'schedule',
    startDate: '2018-11-12T00:32:08.000Z',
    endDate: '2018-11-12T23:32:17.000Z',
    startTime: '2018-11-16T15:00:00.000Z',
    endTime: '2018-11-17T01:00:00.000Z',
    scheduleType: 'exception',
    mallId: 1,
  },
};
const mockState: Partial<ApplicationState> = {
  entities: {
    malls: {
      '2': {
        deleted: false,
        deletedBy: null,
        deletedUserType: null,
        id: 2,
        name: 'DELETE_ME',
        stringId: 'aCD',
        buildingId: 1,
        created: '2018-11-06T23:13:23.772Z',
        modified: '2018-11-12T21:04:27.000Z',
      },
    },
    schedules: scheduleList,
  },
};
test('getMallSchedulesByType', () => {
  let result = getMallSchedulesByType(
    mockState as ApplicationState,
    {},
    1,
    'default'
  );
  expect(result.length).toBe(5);
  result = getMallSchedulesByType(
    mockState as ApplicationState,
    {},
    1,
    'exception'
  );
  expect(result.length).toBe(1);
});

test('getMallById returns mall if found', () => {
  const result = getMallById(mockState as ApplicationState, 2);
  expect(result).toBeTruthy();
});

test('getMallById returns undefined if not found', () => {
  const result = getMallById(mockState as ApplicationState, 0);
  expect(result).toBe(undefined);
});
