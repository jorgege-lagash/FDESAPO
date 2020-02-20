import { intitializeBaseResource } from 'src/utils';
import { types } from '../actions/category.action';
import categoryReducer, { CategoryState } from './category.reducer';

test('fetch categories', () => {
  const mockState: CategoryState = intitializeBaseResource();
  let nextState = categoryReducer(mockState, {
    type: types.FETCH_LIST_SUCCESS,
    payload: {
      ids: [3, 4, 5],
    },
  });
  expect(nextState.list).toEqual([3, 4, 5]);
  nextState = categoryReducer(mockState, {
    type: types.FETCH_LIST_SUCCESS,
    payload: {
      ids: undefined,
    },
  });
  expect(nextState.list).toEqual([]);
});

test('fetch category', () => {
  const mockState: CategoryState = {
    ...intitializeBaseResource(),
    list: [2, 6],
  };
  const nextState = categoryReducer(mockState, {
    type: types.FETCH_SUCCESS,
    payload: {
      ids: [30],
    },
  });
  expect(nextState.list).toEqual([2, 6, 30]);
});

test('fetch categories failure', () => {
  const error = {
    statusCode: 404,
    message: 'ups!',
  };
  const mockState: CategoryState = {
    ...intitializeBaseResource(),
  };
  const nextState = categoryReducer(mockState, {
    type: types.FETCH_LIST_FAILURE,
    payload: {
      error,
    },
  });
  expect(nextState.error).toEqual(error);
});
