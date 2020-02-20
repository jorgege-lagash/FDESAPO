import { Mall } from 'src/types/Mall';
import { actions, types } from './mall.action';

describe('create mall actions', () => {
  test('create mall action is generated correctly', () => {
    const userId = 1;
    const mall: Mall = {
      id: 0,
      name: 'test mall',
      description: 'this is a mock',
      stringId: 'ABC',
      buildingId: 1,
      timezone: 'America/Santiago',
    };
    const result = actions.createMall(userId, mall);
    expect(result.type).toEqual(types.CREATE_MALL_REQUEST);
    expect(result.payload).toBeDefined();
    expect(result.payload.mall).toEqual(mall);
    expect(result.payload.userId).toEqual(userId);
  });

  test('create mall success action is generated correctly', () => {
    const ids = [1, 2, 3];
    const entities = {
      malls: {
        1: {
          name: 'test mall',
        },
      },
    };
    const result = actions.createMallSuccess(ids, entities);
    expect(result.type).toEqual(types.CREATE_MALL_SUCCESS);
    expect(result.payload).toBeDefined();
    expect(result.payload.ids).toEqual(ids);
    expect(result.payload.entities).toEqual(entities);
  });

  test('create mall failure action is generated correctly', () => {
    const error = {
      statusCode: 404,
      message: 'test error message',
    };
    const result = actions.createMallFailure(error);
    expect(result.type).toEqual(types.CREATE_MALL_FAILURE);
    expect(result.payload).toBeDefined();
    expect(result.payload.error).toEqual(error);
  });
});

describe('update mall actions', () => {
  test('update mall action is generated correctly', () => {
    const mallId = 1;
    const mall: Mall = {
      id: 0,
      name: 'test mall',
      description: 'this is a mock',
      stringId: 'ABC',
      buildingId: 1,
      timezone: 'America/Santiago',
    };
    const result = actions.updateMall(mallId, mall, {});
    expect(result.type).toEqual(types.UPDATE_MALL_REQUEST);
    expect(result.payload).toBeDefined();
    expect(result.payload.mall).toEqual(mall);
    expect(result.payload.mallId).toEqual(mallId);
  });

  test('update mall success action is generated correctly', () => {
    const ids = [1, 2, 3];
    const entities = {
      malls: {
        1: {
          name: 'test mall',
        },
      },
    };
    const result = actions.updateMallSuccess(ids, entities);
    expect(result.type).toEqual(types.UPDATE_MALL_SUCCESS);
    expect(result.payload).toBeDefined();
    expect(result.payload.ids).toEqual(ids);
    expect(result.payload.entities).toEqual(entities);
  });

  test('update mall failure action is generated correctly', () => {
    const error = {
      statusCode: 404,
      message: 'test error message',
    };
    const result = actions.updateMallFailure(error);
    expect(result.type).toEqual(types.UPDATE_MALL_FAILURE);
    expect(result.payload).toBeDefined();
    expect(result.payload.error).toEqual(error);
  });
});

describe('fetch mall list actions', () => {
  test('fetch mall list action is generated correctly', () => {
    const result = actions.fetchMallList();
    expect(result.type).toEqual(types.FETCH_MALL_LIST_REQUEST);
    expect(result.payload).toBeDefined();
  });
});
