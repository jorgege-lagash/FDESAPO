import {
  addUniqueValue,
  arrayToMap,
  createPaginationObject,
  intitializeBaseResource,
  unique,
  weekday,
} from '.';
const repeatedValuesArray = [1, 2, 5, 3, 4, 1, 2, 2, 3, 5, 6, 7, 1];
test('unique doesnt repeat values', () => {
  const result = unique(repeatedValuesArray);
  expect(result.length).toBe(7);
});

describe('addUniqueValue', () => {
  test('addUniqueValue doesnt repeat values', () => {
    const result = addUniqueValue(repeatedValuesArray, 3);
    expect(result.length).toBe(7);
  });
  test('addUniqueValue doesnt repeat values', () => {
    const result = addUniqueValue(repeatedValuesArray, 8);
    expect(result.length).toBe(8);
  });
});

test('intitializeBaseResource is generated correctly', () => {
  const result = intitializeBaseResource();
  expect(result.error).toBeFalsy();
  expect(result.saved).toBe(false);
  expect(result.isLoading).toBe(false);
  expect(result.isLoading).toBe(false);
});

test('arrayToMap', () => {
  const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
  const result = arrayToMap(data);
  expect(Object.keys(result).length).toBe(4);
  expect(result[4]).toEqual({ id: 4 });
});

test('weekday has correct length', () => {
  expect(weekday.length).toBe(7);
});

describe('createPaginationObject', () => {
  it('without parameters returns null', () => {
    const result = createPaginationObject();
    expect(result).toBeNull();
  });
  it('with just page parameter returns correct data', () => {
    const result = createPaginationObject(1);
    expect(result).toBeTruthy();
    expect(result).toEqual({ page: 1 });
  });
  it('with page and limit parameter returns correct data', () => {
    let result = createPaginationObject(1, 15);
    expect(result).toBeTruthy();
    expect(result).toEqual({ skip: 0, limit: 15 });
    result = createPaginationObject(3, 15);
    expect(result).toBeTruthy();
    expect(result).toEqual({ skip: 30, limit: 15 });
  });
  it('with skip and limit parameter returns correct data', () => {
    const skip = 40;
    const limit = 12;
    const result = createPaginationObject(undefined, limit, skip);
    expect(result).toBeTruthy();
    expect(result).toEqual({ skip, limit });
  });
});
