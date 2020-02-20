import { actions, types } from './poi.action';

describe('fetch poi list actions', () => {
  test('fetch poi list action is generated correctly', () => {
    const mallId = 1;
    const result = actions.fetchPoiList(mallId);
    expect(result.type).toEqual(types.FETCH_POI_LIST_REQUEST);
    expect(result.payload).toBeDefined();
    expect(result.payload.mallId).toBe(mallId);
  });
});
