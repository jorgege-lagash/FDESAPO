import { intitializeBaseResource } from 'src/utils';
import { types } from '../actions/poi.action';
import poiReducer, { PoiState } from './poi.reducer';

test('fetch pois', () => {
  const mockState: PoiState = intitializeBaseResource();
  let nextState = poiReducer(mockState, {
    type: types.FETCH_POI_LIST_SUCCESS,
    payload: {
      ids: [3, 4, 5],
    },
  });
  expect(nextState.list).toEqual([3, 4, 5]);
  nextState = poiReducer(mockState, {
    type: types.FETCH_POI_LIST_SUCCESS,
    payload: {
      ids: undefined,
    },
  });
  expect(nextState.list).toEqual([]);
});

test('fetch poi', () => {
  const mockState: PoiState = {
    ...intitializeBaseResource(),
    list: [2, 6],
  };
  const nextState = poiReducer(mockState, {
    type: types.FETCH_POI_LIST_SUCCESS,
    payload: {
      ids: [30],
    },
  });
  expect(nextState.list).toEqual([2, 6, 30]);
});

test('fetch pois failure', () => {
  const error = {
    statusCode: 404,
    message: 'ups!',
  };
  const mockState: PoiState = {
    ...intitializeBaseResource(),
  };
  const nextState = poiReducer(mockState, {
    type: types.FETCH_POI_LIST_FAILURE,
    payload: {
      error,
    },
  });
  expect(nextState.error).toEqual(error);
});
