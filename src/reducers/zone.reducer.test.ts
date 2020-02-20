import { intitializeBaseResource } from 'src/utils';
import { types } from '../actions/zone.action';
import zoneReducer, { ZoneState } from './zone.reducer';
test('fetch one zone', () => {
  const mockState: ZoneState = {
    ...intitializeBaseResource(),
    list: [2, 6],
  };
  const nextState = zoneReducer(mockState, {
    type: types.FETCH_ZONE_SUCCESS,
    payload: {
      ids: [30],
    },
  });
  expect(nextState.list).toEqual([2, 6, 30]);
});

test('fetchZones', () => {
  const mockState: ZoneState = intitializeBaseResource();
  let nextState = zoneReducer(mockState, {
    type: types.FETCH_ZONE_LIST_SUCCESS,
    payload: {
      ids: [3, 4, 5],
    },
  });
  expect(nextState.list).toEqual([3, 4, 5]);
  nextState = zoneReducer(mockState, {
    type: types.FETCH_ZONE_LIST_SUCCESS,
    payload: {
      ids: undefined,
    },
  });
  expect(nextState.list).toEqual([]);
});
