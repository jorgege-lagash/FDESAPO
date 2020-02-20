import moment from 'moment';
import { ApplicationState } from 'src/reducers';
import { intitializeBaseResource } from 'src/utils';
import {
  getEventDirectoryArray,
  getEventDirectoryById,
  getEventsByMallId,
  getFormatedEvents,
  getGlobalEventDirectoryIds,
} from './event-directory.selector';

const mockState: Partial<ApplicationState> = {
  entities: {
    events: {
      1: {
        mallId: 1,
        startDate: '2019-05-16T13:02:00.000Z',
        endDate: '2019-05-26T01:21:00.000Z',
        displayEndDate: '2019-06-09',
        displayStartDate: '2019-05-06',
        name: 'evento musical',
        description: 'descripcion de evento 1',
      },
      2: {
        mallId: 2,
        startDate: '2019-05-17T13:02:00.000Z',
        endDate: '2019-05-27T01:21:00.000Z',
        displayEndDate: '2019-06-07',
        displayStartDate: '2019-05-07',
        name: 'evento musical de jazz 2',
        description: 'descripcion de evento 2',
      },
    },
  },
  events: {
    ...intitializeBaseResource(),
    list: [1, 2],
    isLoading: false,
  },
};

test('getEventDirectoryArray returns an array of deals', () => {
  const result = getEventDirectoryArray(mockState as ApplicationState);
  expect(result.length).toBe(2);
  expect(result[0]).toEqual(mockState.entities!.events[1]);
});

test('getGlobalEventDirectoryIds returns an array of ids', () => {
  const result = getGlobalEventDirectoryIds(mockState as ApplicationState);
  expect(result.length).toBe(2);
  expect(result[0]).toBe('1');
});

test('getEventDirectorysByMallId', () => {
  let result = getEventsByMallId(mockState as ApplicationState, 1);
  expect(result.length).toBe(1);
  result = getEventsByMallId(mockState as ApplicationState, 2);
  expect(result.length).toBe(1);
});

test('getEventDirectoryById returns a deal object', () => {
  const result = getEventDirectoryById(mockState as ApplicationState, '1');
  expect(result).toEqual({
    mallId: 1,
    startDate: '2019-05-16T13:02:00.000Z',
    endDate: '2019-05-26T01:21:00.000Z',
    displayEndDate: '2019-06-09',
    displayStartDate: '2019-05-06',
    name: 'evento musical',
    description: 'descripcion de evento 1',
  });
});

const demorEvent = {
  id: 1,
  mallId: 1,
  startDate: '9-05-06T18:18:48.000Z',
  endDate: '2019-05-18T18:18:48.000Z',
  displayStartDate: '2019-07-05',
  displayEndDate: '2019-07-18',
  name: 'Test formated',
  description: 'Test formated description',
};

test('getFormatedEvents', () => {
  const result = getFormatedEvents(
    [demorEvent],
    moment('2019-07-03', 'YYYY-MM-DD').startOf('day')
  );
  expect(result.length).toBe(1);
  expect(result[0].state).toBe('scheduled');
});
