import {
  genericEntitySuccessAction,
  genericRequestFailureAction,
} from './action-utils';

test('genericEntitySuccessAction is generated correctly', () => {
  const ids = [1, 2, 3];
  const entities = {
    malls: {
      1: {
        name: 'test mall',
      },
    },
  };
  const actionType = 'GENERIC/ACTION_TYPE';
  const action = genericEntitySuccessAction(actionType);
  const result = action(ids, entities);
  expect(result.type).toEqual(actionType);
  expect(result.payload).toBeDefined();
  expect(result.payload.ids).toEqual(ids);
  expect(result.payload.entities).toEqual(entities);
});

test('genericRequestFailureAction is generated correctly', () => {
  const error = {
    statusCode: 404,
    message: 'test error message',
  };
  const actionType = 'GENERIC/ACTION_TYPE_ERROR';
  const action = genericRequestFailureAction(actionType);
  const result = action(error);
  expect(result.type).toEqual(actionType);
  expect(result.payload).toBeDefined();
  expect(result.payload.error).toEqual(error);
});
