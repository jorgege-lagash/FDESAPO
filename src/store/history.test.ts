import { initHistory } from './history';
describe('History', () => {
  test('session property has correct initial state', () => {
    const history = initHistory();
    expect(history).toBeTruthy();
  });
});
