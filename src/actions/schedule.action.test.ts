import { Schedule } from 'src/types/response/Schedule';
import { actions, types } from './schedule.action';

const mallId = 1;
const schedule: Schedule = new Schedule({
  id: 2,
  title: 'schedule',
  description: 'schedule',
  startDate: '2018-11-12 14:32:08',
  endDate: '2019-11-12 14:32:17',
  startTime: '9:00',
  endTime: '20:00',
  isRecurring: true,
  recurringType: 'weekly',
  dayOfWeek: 2,
  scheduleType: 'default',
  mallId: 1,
});
describe('create schedule actions', () => {
  test('create schedule action is generated correctly', () => {
    const result = actions.createSchedule(mallId, [schedule]);
    expect(result.type).toEqual(types.CREATE_SCHEDULE_REQUEST);
    expect(result.payload).toBeDefined();
    expect(result.payload.schedules).toEqual([schedule]);
    expect(result.payload.mallId).toEqual(mallId);
  });
});

describe('update schedule actions', () => {
  test('update schedule action is generated correctly', () => {
    const result = actions.updateSchedule(mallId, schedule);
    expect(result.type).toEqual(types.UPDATE_SCHEDULE_REQUEST);
    expect(result.payload).toBeDefined();
    expect(result.payload.schedule).toEqual(schedule);
    expect(result.payload.mallId).toEqual(mallId);
  });
});

describe('fetch schedule list actions', () => {
  test('fetch schedule list action is generated correctly', () => {
    const result = actions.fetchScheduleList(mallId, 'default');
    expect(result.type).toEqual(types.FETCH_SCHEDULE_LIST_REQUEST);
    expect(result.payload).toBeDefined();
    expect(result.payload.scheduleType).toEqual('default');
    expect(result.payload.mallId).toEqual(mallId);
  });
});
