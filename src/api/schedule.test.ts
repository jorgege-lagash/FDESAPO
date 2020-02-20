import { ScheduleDTO } from 'src/types/response/Schedule';
import { schedule } from './schedule';

it('create schedule', async () => {
  expect.assertions(1);
  const scheduleData = {
    id: 1,
    title: 'schedule',
    description: 'schedule',
    // tslint:disable-next-line:no-duplicate-string
    startDate: '2018-11-12 14:32:08',
    // tslint:disable-next-line:no-duplicate-string
    endDate: '2019-11-12 14:32:17',
    startTime: '9:00',
    endTime: '20:00',
    isRecurring: true,
    recurringType: 'weekly',
    dayOfWeek: 1,
    scheduleType: 'default',
    mallId: 1,
  };
  (fetch as any).resetMocks();
  (fetch as any).mockResponses([JSON.stringify(scheduleData), { status: 201 }]);
  let response: any;
  try {
    response = await schedule.create(1, [scheduleData] as ScheduleDTO[]);
  } catch (error) {
    expect(error).toBeFalsy();
  }
  expect(response).toEqual(scheduleData);
});

it('update schedule', async () => {
  expect.assertions(2);
  const scheduleData = {
    id: 1,
    title: 'schedule',
    description: 'schedule',
    startDate: '2018-11-12 14:32:08',
    endDate: '2019-11-12 14:32:17',
    startTime: '9:00',
    endTime: '20:00',
    isRecurring: true,
    recurringType: 'weekly',
    dayOfWeek: 1,
    scheduleType: 'default',
    mallId: 1,
  };
  (fetch as any).resetMocks();
  (fetch as any).mockResponses([JSON.stringify(scheduleData), { status: 201 }]);

  try {
    const response = await schedule.update(1, 1, scheduleData as ScheduleDTO);
    expect(response).toBeTruthy();
    expect(response).toEqual(scheduleData);
  } catch (error) {
    expect(error).toBeFalsy();
  }
});

it('get schedule list', async () => {
  expect.assertions(2);
  const scheduleList = [
    {
      id: 1,
      title: 'schedule',
      description: 'schedule',
      startDate: '2018-11-12 14:32:08',
      endDate: '2019-11-12 14:32:17',
      startTime: '9:00',
      endTime: '20:00',
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
      startDate: '2018-11-12 14:32:08',
      endDate: '2019-11-12 14:32:17',
      startTime: '9:00',
      endTime: '20:00',
      isRecurring: true,
      recurringType: 'weekly',
      dayOfWeek: 1,
      scheduleType: 'default',
      mallId: 1,
    },
  ];
  (fetch as any).resetMocks();
  (fetch as any).mockResponses([JSON.stringify(scheduleList), { status: 201 }]);

  try {
    const response = await schedule.fetch(1, undefined, undefined, 'default');
    expect(response).toBeTruthy();
    expect(response.length).toBe(2);
  } catch (error) {
    expect(error).toBeFalsy();
  }
});
