import { actions, types } from './category.action';

describe('fetch category list actions', () => {
  test('fetch category list action is generated correctly', () => {
    const mallId = 1;
    const result = actions.fetchCategoryList(mallId);
    expect(result.type).toEqual(types.FETCH_LIST_REQUEST);
    expect(result.payload).toBeDefined();
    expect(result.payload.mallId).toBe(mallId);
  });
});

test('create category success action is generated correctly', () => {
  const ids = [1, 2, 3];
  const entities = {
    categories: {
      1: {
        mallId: 1,
        poiTypeId: 2,
        name: 'category 1',
      },
    },
  };
  const result = actions.createEntitySuccess(ids, entities);
  expect(result.type).toEqual(types.CREATE_SUCCESS);
  expect(result.payload).toBeDefined();
  expect(result.payload.ids).toEqual(ids);
  expect(result.payload.entities).toEqual(entities);
});

test('create category failure action is generated correctly', () => {
  const error = {
    statusCode: 404,
    message: 'test error message',
  };
  const result = actions.createEntityFailure(error);
  expect(result.type).toEqual(types.CREATE_FAILURE);
  expect(result.payload).toBeDefined();
  expect(result.payload.error).toEqual(error);
});
