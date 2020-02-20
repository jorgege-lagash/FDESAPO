import { ApplicationState } from 'src/reducers';
import { intitializeBaseResource } from 'src/utils';
import {
  getGlobalZoneIds,
  getMallZoneArray,
  getZoneById,
  getZonesByMallId,
} from './zone.selector';

const mockState: Partial<ApplicationState> = {
  entities: {
    zones: {
      1: {
        name: '1',
        mallId: 2,
      },
      2: {
        name: '2',
        mallId: 2,
      },
      3: {
        name: '3',
        mallId: 3,
      },
      4: {
        name: '4',
        mallId: 2,
      },
    },
  },
  zones: {
    ...intitializeBaseResource(),
    list: [1, 3],
    isLoading: false,
  },
};
test('getMallZoneArray returns an array of zones', () => {
  const result = getMallZoneArray(mockState as ApplicationState);
  expect(result.length).toBe(2);
  expect(result[0]).toEqual(mockState.entities!.zones[1]);
});

test('getGlobalZoneIds', () => {
  const result = getGlobalZoneIds(mockState as ApplicationState);
  expect(result.length).toBe(4);
});

test('getZonesByMallId', () => {
  let result = getZonesByMallId(mockState as ApplicationState, 2);
  expect(result.length).toBe(3);
  result = getZonesByMallId(mockState as ApplicationState, 3);
  expect(result.length).toBe(1);
  result = getZonesByMallId(mockState as ApplicationState, 3);
  expect(result.length).toBe(1);
});

test('getZoneById', () => {
  let result = getZoneById(mockState as ApplicationState, '2');
  expect(result).toEqual({
    name: '2',
    mallId: 2,
  });
  result = getZoneById(mockState as ApplicationState, '3');
  expect(result).toEqual({
    name: '3',
    mallId: 3,
  });
});
