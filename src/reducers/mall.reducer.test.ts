import { intitializeBaseResource } from 'src/utils';
import { types } from '../actions/mall.action';
import mallReducer, { MallState } from './mall.reducer';
test('selectMall', () => {
  const mockState: MallState = intitializeBaseResource();
  const nextState = mallReducer(mockState, {
    type: types.SELECT_MALL,
    payload: {
      mallId: 30,
    },
  });
  expect(nextState.selectedMall).toBe(30);
});

test('fetchMalls', () => {
  const mockState: MallState = intitializeBaseResource();
  let nextState = mallReducer(mockState, {
    type: types.FETCH_MALL_LIST_SUCCESS,
    payload: {
      ids: [3, 4, 5],
    },
  });
  expect(nextState.list).toEqual([3, 4, 5]);
  nextState = mallReducer(mockState, {
    type: types.FETCH_MALL_LIST_SUCCESS,
    payload: {
      ids: undefined,
    },
  });
  expect(nextState.list).toEqual([]);
});
