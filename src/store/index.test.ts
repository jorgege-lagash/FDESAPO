import { initialState } from '../reducers/auth.reducer';
import defaultStore from './index';

describe('Redux Store', () => {
  test('session property has correct initial state', () => {
    expect(defaultStore.getState().session).toEqual(initialState);
  });
});
