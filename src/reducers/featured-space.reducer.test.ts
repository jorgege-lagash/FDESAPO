import { intitializeBaseResource } from 'src/utils';
import { types } from '../actions/featured-space.action';
import featuredSpaceReducer, {
  FeaturedSpaceState,
} from './featured-space.reducer';

test('fetch featuredSpaces', () => {
  const mockState: FeaturedSpaceState = intitializeBaseResource();
  let nextState = featuredSpaceReducer(mockState, {
    type: types.FETCH_LIST_SUCCESS,
    payload: {
      ids: [3, 4, 5],
    },
  });
  expect(nextState.list).toEqual([3, 4, 5]);
  nextState = featuredSpaceReducer(mockState, {
    type: types.FETCH_LIST_SUCCESS,
    payload: {
      ids: undefined,
    },
  });
  expect(nextState.list).toEqual([]);
});

test('fetch featuredSpace', () => {
  const mockState: FeaturedSpaceState = {
    ...intitializeBaseResource(),
    list: [2, 6],
  };
  const nextState = featuredSpaceReducer(mockState, {
    type: types.FETCH_SUCCESS,
    payload: {
      ids: [30],
    },
  });
  expect(nextState.list).toEqual([2, 6, 30]);
});

test('fetch featuredSpace failure', () => {
  const error = {
    statusCode: 404,
    message: 'ups!',
  };
  const mockState: FeaturedSpaceState = {
    ...intitializeBaseResource(),
  };
  const nextState = featuredSpaceReducer(mockState, {
    type: types.FETCH_LIST_FAILURE,
    payload: {
      error,
    },
  });
  expect(nextState.error).toEqual(error);
});
