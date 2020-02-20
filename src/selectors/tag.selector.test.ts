import { ApplicationState } from 'src/reducers';
import { intitializeBaseResource } from 'src/utils';
import {
  getGlobalTagIds,
  getTagArray,
  getTagById,
  getTagsByMallId,
} from './tag.selector';

const mockState: Partial<ApplicationState> = {
  entities: {
    tags: {
      1: {
        name: 'tag 1',
        languageId: 1,
        mallId: 1,
      },
      2: {
        name: 'tag 2',
        languageId: 1,
        mallId: 1,
      },
      3: {
        name: 'tag 3',
        languageId: 1,
        mallId: 1,
      },
      4: {
        name: 'tag 4',
        languageId: 1,
        mallId: 2,
      },
    },
  },
  tags: {
    ...intitializeBaseResource(),
    list: [1, 2],
    isLoading: false,
  },
};

test('getTagArray returns an array of categories', () => {
  const result = getTagArray(mockState as ApplicationState);
  expect(result.length).toBe(2);
  expect(result[0]).toEqual(mockState.entities!.tags[1]);
});

test('getGlobalCategoryIds returns an array of ids', () => {
  const result = getGlobalTagIds(mockState as ApplicationState);
  expect(result.length).toBe(4);
  expect(result[0]).toBe('1');
});

test('getZonesByMallId', () => {
  let result = getTagsByMallId(mockState as ApplicationState, 1);
  expect(result.length).toBe(3);
  result = getTagsByMallId(mockState as ApplicationState, 2);
  expect(result.length).toBe(1);
});

test('getCategoryById returns a category object', () => {
  let result = getTagById(mockState as ApplicationState, '1');
  expect(result).toEqual({
    name: 'tag 1',
    languageId: 1,
    mallId: 1,
  });
  result = getTagById(mockState as ApplicationState, '4');
  expect(result).toEqual({
    name: 'tag 4',
    languageId: 1,
    mallId: 2,
  });
});
