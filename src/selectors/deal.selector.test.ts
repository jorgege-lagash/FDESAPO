import moment from 'moment';
import { ApplicationState } from 'src/reducers';
import { intitializeBaseResource } from 'src/utils';
import {
  getDealArray,
  getDealById,
  getDealsByMallId,
  getFormatedDeals,
  getGlobalDealIds,
} from './deal.selector';

const mockState: Partial<ApplicationState> = {
  entities: {
    deals: {
      1: {
        mallId: 1,
        startDate: '2018-05-06T18:18:48.000Z',
        poiId: 1,
        endDate: '2018-05-18T18:18:48.000Z',
        displayStartDate: '2019-05-06',
        displayEndDate: '2019-05-18',
        title: 'Test 1',
        description: 'Test 1 description',
      },
      2: {
        mallId: 2,
        startDate: '2018-05-05T18:18:48.000Z',
        poiId: 2,
        endDate: '2018-05-13T18:18:48.000Z',
        displayStartDate: '2019-05-05',
        displayEndDate: '2019-05-14',
        title: 'Test 2',
        description: 'Test 2 description',
      },
    },
  },
  deals: {
    ...intitializeBaseResource(),
    list: [1, 2],
    isLoading: false,
  },
};

test('getDealArray returns an array of deals', () => {
  const result = getDealArray(mockState as ApplicationState);
  expect(result.length).toBe(2);
  expect(result[0]).toEqual(mockState.entities!.deals[1]);
});

test('getGlobalDealIds returns an array of ids', () => {
  const result = getGlobalDealIds(mockState as ApplicationState);
  expect(result.length).toBe(2);
  expect(result[0]).toBe('1');
});

test('getDealsByMallId', () => {
  let result = getDealsByMallId(mockState as ApplicationState, 1);
  expect(result.length).toBe(1);
  result = getDealsByMallId(mockState as ApplicationState, 2);
  expect(result.length).toBe(1);
});

test('getDealById returns a deal object', () => {
  const result = getDealById(mockState as ApplicationState, '1');
  expect(result).toEqual({
    mallId: 1,
    startDate: '2018-05-06T18:18:48.000Z',
    poiId: 1,
    endDate: '2018-05-18T18:18:48.000Z',
    displayStartDate: '2019-05-06',
    displayEndDate: '2019-05-18',
    title: 'Test 1',
    description: 'Test 1 description',
  });
});

const demorDeal = {
  id: 1,
  mallId: 1,
  startDate: '9-05-06T18:18:48.000Z',
  poiId: 1,
  endDate: '2019-05-18T18:18:48.000Z',
  displayStartDate: '2019-07-05',
  displayEndDate: '2019-07-18',
  title: 'Test formated',
  description: 'Test formated description',
};

test('getFormatedDeals', () => {
  const result = getFormatedDeals(
    [demorDeal],
    moment('2019-07-05', 'YYYY-MM-DD').startOf('day')
  );
  expect(result.length).toBe(1);
  expect(result[0].state).toBe('published');
});
